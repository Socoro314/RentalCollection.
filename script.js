let payments =
    JSON.parse(localStorage.getItem("payments")) || [];

let editIndex = -1;

displayPayments();
updateDashboard();

function savePayment() {

    const tenant = document.getElementById("tenant").value;
    const unit = document.getElementById("unit").value;
    const rent = Number(document.getElementById("rent").value);
    const amount = Number(document.getElementById("amount").value);

    if (!tenant || !unit || !rent || !amount) {
        alert("Please fill all fields");
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
    displayPayments();
    updateDashboard();
}

function clearForm() {
    document.getElementById("tenant").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("rent").value = "";
    document.getElementById("amount").value = "";
}

function displayPayments() {

    const list = document.getElementById("paymentList");
    list.innerHTML = "";

    payments.forEach((p, index) => {

        const li = document.createElement("li");

        li.innerHTML =
            `<b>${p.tenant}</b> | Unit ${p.unit} |
            Paid $${p.amount} / Rent $${p.rent} |
            Date: ${p.date} `;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            document.getElementById("tenant").value = p.tenant;
            document.getElementById("unit").value = p.unit;
            document.getElementById("rent").value = p.rent;
            document.getElementById("amount").value = p.amount;
            editIndex = index;
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            payments.splice(index, 1);
            localStorage.setItem("payments", JSON.stringify(payments));
            displayPayments();
            updateDashboard();
        };

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

function updateDashboard() {

    let totalCollected = 0;
    let totalExpected = 0;

    payments.forEach(p => {
        totalCollected += Number(p.amount);
        totalExpected += Number(p.rent);
    });

    document.getElementById("totalCollected").textContent = totalCollected;
    document.getElementById("totalExpected").textContent = totalExpected;
    document.getElementById("balance").textContent =
        totalExpected - totalCollected;
}
