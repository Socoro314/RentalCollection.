let payments =
    JSON.parse(localStorage.getItem("payments")) || [];

displayPayments();
updateDashboard();
updateUnpaidList();

function savePayment() {

    const tenant = document.getElementById("tenant").value;
    const unit = document.getElementById("unit").value;
    const rent = Number(document.getElementById("rent").value);
    const amount = Number(document.getElementById("amount").value);

    if (!tenant || !unit || !rent || !amount) {
        alert("Please fill all fields");
        return;
    }

    payments.push({
        tenant,
        unit,
        rent,
        amount,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("payments", JSON.stringify(payments));

    clearForm();

    displayPayments();
    updateDashboard();
    updateUnpaidList();
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

        li.textContent =
            `${p.tenant} | Unit ${p.unit} | Paid $${p.amount} | Rent $${p.rent} | ${p.date}`;

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

function updateUnpaidList() {

    const list = document.getElementById("unpaidList");
    list.innerHTML = "";

    payments.forEach(p => {

        const balance = Number(p.rent) - Number(p.amount);

        if (balance > 0) {

            const li = document.createElement("li");

            li.textContent =
                `${p.tenant} owes $${balance} (Unit ${p.unit})`;

            li.style.color = "red";

            list.appendChild(li);
        }
    });
}
