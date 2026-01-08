let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentAccount = null;

const output = document.getElementById("output");
const historyPopup = document.getElementById("historyPopup");
const historyList = document.getElementById("historyList");
const thankYou = document.getElementById("thankYou");

document.getElementById("continueBtn").addEventListener("click", startBank);
document.querySelector(".deposit").addEventListener("click", deposit);
document.querySelector(".withdraw").addEventListener("click", withdraw);

// ---------------- START / SELECT ACCOUNT ----------------
function startBank() {
    const name = document.getElementById("username").value.trim();
    const accNo = document.getElementById("account").value.trim();

    if (!name || !accNo) {
        alert("Please enter name and account number");
        return;
    }

    // Create account if new
    if (!accounts[accNo]) {
        accounts[accNo] = {
            name: name,
            balance: 0,
            history: []
        };
    }

    currentAccount = accNo;
    saveAccounts();

    document.getElementById("bankOptions").classList.remove("hidden");
    document.getElementById("continueBtn").disabled = true;

    updateStatus(`Welcome ${accounts[accNo].name}`);
    renderHistory();
    thankYou.classList.add("hidden");
}

// ---------------- DEPOSIT ----------------
function deposit() {
    const amount = Number(document.getElementById("amount").value);
    if (amount < 100) {
        alert("Minimum deposit is ₹100");
        return;
    }

    accounts[currentAccount].balance += amount;
    accounts[currentAccount].history.push(`+ ₹${amount} Deposit`);

    finishTransaction(`₹${amount} deposited successfully`);
}

// ---------------- WITHDRAW ----------------
function withdraw() {
    const amount = Number(document.getElementById("amount").value);
    if (amount > accounts[currentAccount].balance) {
        updateStatus("Insufficient balance");
        return;
    }

    accounts[currentAccount].balance -= amount;
    accounts[currentAccount].history.push(`- ₹${amount} Withdraw`);

    finishTransaction(`₹${amount} withdrawn successfully`);
}

// ---------------- COMMON ----------------
function finishTransaction(message) {
    saveAccounts();
    updateStatus(message);
    renderHistory();
    document.getElementById("amount").value = "";
    thankYou.classList.remove("hidden");
}

// ---------------- HISTORY ----------------
function toggleHistory() {
    historyPopup.classList.toggle("hidden");
}

function renderHistory() {
    historyList.innerHTML = "";
    accounts[currentAccount].history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// ---------------- UI ----------------
function updateStatus(message) {
    output.innerHTML = `
        ${message}<br>
        Balance: ₹${accounts[currentAccount].balance}
    `;
}

// ---------------- STORAGE ----------------
function saveAccounts() {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}
