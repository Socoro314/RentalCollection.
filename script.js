let payments = [];

function savePayment() {

    const tenant = document.getElementById("tenant").value;
    const amount = document.getElementById("amount").value;

    if (tenant === "" || amount === "") {
        alert("Please enter tenant name and amount.");
        return;
    }

    payments.push({
        tenant: tenant,
        amount: amount
    });

    displayPayments();

    document.getElementById("tenant").value = "";
    document.getElementById("amount").value = "";
}

function displayPayments() {

    const paymentList =
        document.getElementById("paymentList");

    paymentList.innerHTML = "";

    payments.forEach(function(payment) {

        const li = document.createElement("li");

        li.textContent =
            payment.tenant +
            " paid $" +
            payment.amount;

        paymentList.appendChild(li);
    });
}