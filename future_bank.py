

class Bank:
    def __init__(self):
        # Store all accounts
        # Key = account number
        self.accounts = {}

    def create_or_get_account(self, name, acc_no):
        """Create new account if not exists, else return old"""
        if acc_no not in self.accounts:
            self.accounts[acc_no] = {
                "name": name,
                "balance": 0,
                "history": []
            }
        return self.accounts[acc_no]

    def deposit(self, acc_no, amount):
        if amount < 100:
            return "Minimum deposit is ₹100"

        self.accounts[acc_no]["balance"] += amount
        self.accounts[acc_no]["history"].append(f"+ ₹{amount} Deposit")
        return f"₹{amount} deposited successfully"

    def withdraw(self, acc_no, amount):
        if amount > self.accounts[acc_no]["balance"]:
            return "Insufficient balance"

        self.accounts[acc_no]["balance"] -= amount
        self.accounts[acc_no]["history"].append(f"- ₹{amount} Withdraw")
        return f"₹{amount} withdrawn successfully"

    def get_balance(self, acc_no):
        return self.accounts[acc_no]["balance"]

    def get_history(self, acc_no):
        return self.accounts[acc_no]["history"]


bank = Bank()

# Old user / New user
bank.create_or_get_account("Rajendra", "123456")
bank.deposit("123456", 500)
bank.deposit("123456", 1000)

# Old user returns
bank.create_or_get_account("Rajendra", "123456")
print("Balance:", bank.get_balance("123456"))

# New user
bank.create_or_get_account("Amit", "999999")
print("New user balance:", bank.get_balance("999999"))

# Withdraw
bank.withdraw("123456", 300)

# Show history
print("\nTransaction History:")
for tx in bank.get_history("123456"):
    print(tx)

