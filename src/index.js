// Track all account balances
let accounts = [];

document.getElementById('open-modal-button').addEventListener('click', () => {
    openModal();
});

// Listen for account data from the main process
window.services.on('account-data', (accountData) => {
    addAccountToList(accountData);
});

function openModal() {
    window.services.send('open-modal');
}

function calculateNetWorth() {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    return totalBalance;
}

function updateNetWorthDisplay() {
    const netWorth = calculateNetWorth();
    const netWorthElement = document.getElementById('net-worth-value');
    netWorthElement.textContent = `$${netWorth.toFixed(2)}`;
}

function addAccountToList(accountData) {
    // Add account to our tracking array
    accounts.push(accountData);

    const accountsContainer = document.getElementById('accounts-container');

    // Create account item element
    const accountItem = document.createElement('div');
    accountItem.className = 'account-item';

    // Create account name element
    const accountName = document.createElement('div');
    accountName.className = 'account-name';
    accountName.textContent = accountData.name;

    // Create account balance element
    const accountBalance = document.createElement('div');
    accountBalance.className = 'account-balance';
    accountBalance.textContent = `Balance: $${accountData.balance.toFixed(2)}`;

    // Add elements to account item
    accountItem.appendChild(accountName);
    accountItem.appendChild(accountBalance);

    // Add account item to accounts container
    accountsContainer.appendChild(accountItem);

    // Update the Net Worth display
    updateNetWorthDisplay();
}
