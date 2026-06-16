let payments = JSON.parse(localStorage.getItem("payments")) || [];

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
        alert("Fill all fields");
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


// CLEAR
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

        const balance = p.rent - p.amount;

        const div = document.createElement("div");

        div.innerHTML = `
            <b>${p.tenant}</b> | ${p.property} | Unit ${p.unit}<br>
            Paid $${p.amount} / Rent $${p.rent}<br>
            Balance: $${balance} | Date: ${p.date}
        `;

        const receiptBtn = document.createElement("button");
        receiptBtn.textContent = "Receipt";
        receiptBtn.onclick = () => {

            const receiptWindow = window.open("", "", "width=400,height=400");

            receiptWindow.document.write(`
                <h2>Receipt</h2>
                <p>Tenant: ${p.tenant}</p>
                <p>Property: ${p.property}</p>
                <p>Unit: ${p.unit}</p>
                <p>Paid: $${p.amount}</p>
                <p>Date: ${p.date}</p>
            `);
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
            payments.splice(index, 1);
            localStorage.setItem("payments", JSON.stringify(payments));
            refreshAll();
        };

        div.appendChild(receiptBtn);
        div.appendChild(delBtn);

        container.appendChild(div);
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


// UNPAID
function updateUnpaidList() {

    const container = document.getElementById("unpaidList");
    container.innerHTML = "";

    payments.forEach(p => {

        const balance = p.rent - p.amount;

        if (balance > 0) {

            const div = document.createElement("div");
            div.textContent = `${p.tenant} owes $${balance} (${p.property})`;

            container.appendChild(div);
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


// CSV EXPORT
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


// REFRESH
function refreshAll() {
    displayPayments();
    updateDashboard();
    updateUnpaidList();
}
