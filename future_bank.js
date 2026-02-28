let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let currentAccount = null;

const nameInput = document.getElementById("username");
const accountInput = document.getElementById("account");
const amountInput = document.getElementById("amount");

const output = document.getElementById("output");
const historyPopup = document.getElementById("historyPopup");
const historyList = document.getElementById("historyList");
const thankYou = document.getElementById("thankYou");

const continueBtn = document.getElementById("continueBtn");
const logoutBtn = document.getElementById("logoutBtn");
const bankOptions = document.getElementById("bankOptions");
const suggestionBox = document.getElementById("nameSuggestions");

continueBtn.addEventListener("click", startBank);
logoutBtn.addEventListener("click", logout);

document.querySelector(".deposit").addEventListener("click", deposit);
document.querySelector(".withdraw").addEventListener("click", withdraw);

nameInput.addEventListener("input", showNameSuggestions);

// ✅ allow only letters & spaces in name
nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z ]/g, "");
});

accountInput.addEventListener("input", () => {
    accountInput.value = accountInput.value.replace(/\D/g, "");
});

// ---------- SHOW NAME SUGGESTIONS ----------
function showNameSuggestions() {
    const input = nameInput.value.toLowerCase();
    suggestionBox.innerHTML = "";

    if (!input) {
        suggestionBox.classList.add("hidden");
        return;
    }

    const used = new Set();

    for (let accNo in accounts) {
        const name = accounts[accNo].name;
        if (name.toLowerCase().startsWith(input) && !used.has(name)) {
            used.add(name);

            const li = document.createElement("li");
            li.textContent = name;
            li.onclick = () => selectUser(name);
            suggestionBox.appendChild(li);
        }
    }

    suggestionBox.classList.toggle("hidden", used.size === 0);
}

function selectUser(name) {
    nameInput.value = name;
    suggestionBox.classList.add("hidden");

    for (let accNo in accounts) {
        if (accounts[accNo].name === name) {
            accountInput.value = accNo;
            updateStatus(`Welcome back ${name}`);
            break;
        }
    }
}

// ---------- START BANK ----------
function startBank() {
    const name = nameInput.value.trim();
    const accNo = accountInput.value.trim();

    if (!name) return alert("Enter customer name");

    // ✅ Name validation (letters & spaces only)
    if (!/^[A-Za-z ]+$/.test(name)) {
        return alert("Name must contain only letters");
    }

    // ✅ Account must contain only numbers
    if (!/^\d+$/.test(accNo)) {
        return alert("Account number must contain only digits");
    }

    // ✅ Must be exactly 12 digits
    if (!/^\d{12}$/.test(accNo)) {
        return alert("Account number must be 12 digits");
    }

    if (accounts[accNo]) {
        if (accounts[accNo].name !== name) {
            return alert("Account number already linked to another name");
        }
    } else {
        accounts[accNo] = { name, balance: 0, history: [] };
    }

    currentAccount = accNo;
    saveAccounts();

    bankOptions.classList.remove("hidden");
    continueBtn.disabled = true;
    logoutBtn.classList.remove("hidden");
    suggestionBox.classList.add("hidden");

    updateStatus(`Welcome ${name}`);
    renderHistory();
}
// ---------- LOGOUT ----------
function logout() {
    currentAccount = null;

    nameInput.value = "";
    accountInput.value = "";
    amountInput.value = "";

    bankOptions.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    continueBtn.disabled = false;
    historyPopup.classList.add("hidden");

    // ✅ Show thank you message
    thankYou.classList.remove("hidden");
    output.innerHTML = "";

    // ✅ Hide after 5 seconds
    setTimeout(() => {
        thankYou.classList.add("hidden");

        output.innerHTML = `
            Welcome to <b>Future Bank 🏦</b><br>
            Please enter your details to continue
        `;
    }, 3000); // 3 seconds
}

// ---------- TRANSACTIONS ----------
function deposit() {
    if (!currentAccount) return alert("Login first");

    const amt = Number(amountInput.value);
    if (amt <= 0) return;

    accounts[currentAccount].balance += amt;
    accounts[currentAccount].history.push({
        type: "Deposit",
        amount: amt,
        date: new Date().toLocaleString()
    });

    finishTransaction(`₹${amt} deposited`);
}

function withdraw() {
    if (!currentAccount) return alert("Login first");

    const amt = Number(amountInput.value);
    if (amt <= 0 || amt > accounts[currentAccount].balance) return;

    accounts[currentAccount].balance -= amt;
    accounts[currentAccount].history.push({
        type: "Withdraw",
        amount: amt,
        date: new Date().toLocaleString()
    });

    finishTransaction(`₹${amt} withdrawn`);
}

function finishTransaction(msg) {
    saveAccounts();
    updateStatus(msg);
    renderHistory();
    amountInput.value = "";
    thankYou.classList.remove("hidden");
}

// ---------- HISTORY ----------
function toggleHistory() {
    historyPopup.classList.toggle("hidden");
}

function renderHistory() {
    historyList.innerHTML = "";
    accounts[currentAccount]?.history.forEach(h => {
        const li = document.createElement("li");
        li.textContent = `${h.type} ₹${h.amount} (${h.date})`;
        historyList.appendChild(li);
    });
}

// ---------- UI ----------
function updateStatus(msg) {
    output.innerHTML = `
        ${msg}<br>
        Balance: ₹${currentAccount ? accounts[currentAccount].balance : 0}
    `;
}

// ---------- STORAGE ----------
function saveAccounts() {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}
