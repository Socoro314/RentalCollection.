let payments =
    JSON.parse(localStorage.getItem("payments")) || [];

let editIndex = -1;

// INIT
displayPayments();
updateDashboard();
updateUnpaidList();


// LOGIN
function login() {

    const password = document.getElementById("password").value;

    if (password === "1234") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("app").style.display = "block";
    } else {
        document.getElementById("error").textContent = "Wrong password";
    }
}


// SAVE PAYMENT
function savePayment() {

    const tenant = document.getElementById("tenant").value;
    const unit = document.getElementById("unit").value;
    const rent = Number(document.getElementById("rent").value);
    const amount = Number(document.getElementById("amount").value);

    if (!tenant || !unit || !rent || !amount) {
        alert("Fill all fields");
        return;
    }

    const data = {
        tenant,
        unit,
        rent,
        amount,
        date: new Date().toLocaleDateString()
    };

    if (editIndex === -1) {
        payments.push(data);
    } else {
        payments[editIndex] = data;
        editIndex = -1;
    }

    localStorage.setItem("payments", JSON.stringify(payments));

    clearForm();
    refreshAll();
}


// CLEAR FORM
function clearForm() {
    document.getElementById("tenant").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("rent").value = "";
    document.getElementById("amount").value = "";
}


// DISPLAY PAYMENTS
function displayPayments() {

    const list = document.getElementById("paymentList");
    list.innerHTML = "";

    payments.forEach((p, index) => {

        const li = document.createElement("li");

        li.innerHTML =
            `<b>${p.tenant}</b> | Unit ${p.unit} |
            Paid $${p.amount} / Rent $${p.rent} |
            ${p.date} `;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            document.getElementById("tenant").value = p.tenant;
            document.getElementById("unit").value = p.unit;
            document.getElementById("rent").value = p.rent;
            document.getElementById("amount").value = p.amount;
            editIndex = index;
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
            payments.splice(index, 1);
            localStorage.setItem("payments", JSON.stringify(payments));
            refreshAll();
        };

        li.appendChild(editBtn);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}


// DASHBOARD
function updateDashboard() {

    let collected = 0;
    let expected = 0;

    payments.forEach(p => {
        collected += Number(p.amount);
        expected += Number(p.rent);
    });

    document.getElementById("totalCollected").textContent = collected;
    document.getElementById("totalExpected").textContent = expected;
    document.getElementById("balance").textContent = expected - collected;
}


// UNPAID LIST
function updateUnpaidList() {

    const list = document.getElementById("unpaidList");
    list.innerHTML = "";

    payments.forEach(p => {

        const balance = Number(p.rent) - Number(p.amount);

        if (balance > 0) {
            const li = document.createElement("li");
            li.textContent = `${p.tenant} owes $${balance} (Unit ${p.unit})`;
            li.style.color = "red";
            list.appendChild(li);
        }
    });
}


// SEARCH
function searchTenant() {

    const keyword = document.getElementById("searchBox").value.toLowerCase();

    const filtered = payments.filter(p =>
        p.tenant.toLowerCase().includes(keyword)
    );

    const list = document.getElementById("paymentList");
    list.innerHTML = "";

    filtered.forEach(p => {

        const li = document.createElement("li");

        li.textContent =
            `${p.tenant} | Unit ${p.unit} | Paid $${p.amount} | Rent $${p.rent} | ${p.date}`;

        list.appendChild(li);
    });
}


// REFRESH ALL
function refreshAll() {
    displayPayments();
    updateDashboard();
    updateUnpaidList();
}
