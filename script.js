let payments = JSON.parse(localStorage.getItem("payments")) || [];

// INIT
refreshAll();


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
    const property = document.getElementById("property").value;
    const unit = document.getElementById("unit").value;
    const rent = Number(document.getElementById("rent").value);
    const amount = Number(document.getElementById("amount").value);

    if (!tenant || !property || !unit || !rent || !amount) {
        alert("Please fill all fields");
        return;
    }

    payments.push({
        tenant,
        property,
        unit,
        rent,
        amount,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("payments", JSON.stringify(payments));

    clearForm();
    refreshAll();
}


// CLEAR FORM
function clearForm() {
    document.getElementById("tenant").value = "";
    document.getElementById("property").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("rent").value = "";
    document.getElementById("amount").value = "";
}


// DISPLAY PAYMENTS
function displayPayments(list = payments) {

    const container = document.getElementById("paymentList");
    container.innerHTML = "";

    list.forEach((p, index) => {

        const li = document.createElement("li");

        const balance = p.rent - p.amount;

        li.innerHTML =
            `<b>${p.tenant}</b> | ${p.property} | Unit ${p.unit} |
            Paid $${p.amount} / Rent $${p.rent} |
            Balance $${balance} | ${p.date}`;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
            payments.splice(index, 1);
            localStorage.setItem("payments", JSON.stringify(payments));
            refreshAll();
        };

        const receiptBtn = document.createElement("button");
        receiptBtn.textContent = "Receipt";
        receiptBtn.onclick = () => {
            alert(
                "RECEIPT\n\n" +
                "Tenant: " + p.tenant + "\n" +
                "Property: " + p.property + "\n" +
                "Unit: " + p.unit + "\n" +
                "Paid: $" + p.amount + "\n" +
                "Date: " + p.date
            );
        };

        li.appendChild(receiptBtn);
        li.appendChild(delBtn);

        container.appendChild(li);
    });
}


// DASHBOARD
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


// UNPAID LIST
function updateUnpaidList() {

    const list = document.getElementById("unpaidList");
    list.innerHTML = "";

    payments.forEach(p => {

        const balance = p.rent - p.amount;

        if (balance > 0) {
            const li = document.createElement("li");
            li.style.color = "red";
            li.textContent = `${p.tenant} owes $${balance} (${p.property})`;
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

    displayPayments(filtered);
}


// EXPORT CSV
function exportCSV() {

    let csv = "Tenant,Property,Unit,Rent,Paid,Balance,Date\n";

    payments.forEach(p => {
        csv += `${p.tenant},${p.property},${p.unit},${p.rent},${p.amount},${p.rent - p.amount},${p.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rental-data.csv";
    a.click();
}


// REFRESH ALL
function refreshAll() {
    displayPayments();
    updateDashboard();
    updateUnpaidList();
}
