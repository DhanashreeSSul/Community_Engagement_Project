document.getElementById('loanForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const interest = parseFloat(document.getElementById('interest').value) / 100 / 12;
    const months = parseFloat(document.getElementById('months').value);

    if (isNaN(amount) || isNaN(interest) || isNaN(months) || amount <= 0 || interest <= 0 || months <= 0) {
        document.getElementById('result').textContent = "Please enter valid positive numbers.";
        return;
    }

    const emi = calculateEMI(amount, interest, months);
    const totalInterest = (emi * months) - amount;
    const totalPayment = emi * months;

    document.getElementById('result').innerHTML = `
        <div class="result-text">
            <strong>EMI:</strong> ₹${emi.toFixed(2)}<br>
            <strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}<br>
            <strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}
        </div>
    `;
});

function calculateEMI(principal, rate, time) {
    const numerator = principal * rate * Math.pow(1 + rate, time);
    const denominator = Math.pow(1 + rate, time) - 1;
    return numerator / denominator;
}
