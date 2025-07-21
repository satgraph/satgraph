// Track all account balances
let accounts = []

// Load saved accounts when the application starts
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const savedAccounts = await window.services.loadAccounts()
        if (savedAccounts && savedAccounts.length > 0) {
            // Load each saved account into the UI
            savedAccounts.forEach(account => {
                addAccountToList(account)
            })
        }
    } catch (error) {
        console.error('Failed to load accounts:', error)
    }
})

document.getElementById('open-modal-button').addEventListener('click', () => {
    openModal()
})

// Listen for account data from the main process
window.services.on('account-data', (accountData) => {
    addAccountToList(accountData)
})

function openModal() {
    window.services.send('open-modal')
}

function calculateNetWorth() {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
    return totalBalance
}

function updateNetWorthDisplay() {
    const netWorth = calculateNetWorth()
    const netWorthElement = document.getElementById('net-worth-value')
    netWorthElement.textContent = `$${netWorth.toFixed(2)}`
}

// Function to confirm account deletion with a dialog
async function confirmDeleteAccount(accountId) {
    const confirmed = confirm('Are you sure you want to delete this account?')

    if (confirmed) {
        try {
            // Call the deleteAccount method from preload.js
            const updatedAccounts = await window.services.deleteAccount(accountId)

            // Remove the account from the UI
            removeAccountFromUI(accountId)

            // Update the accounts array with the new list
            accounts = updatedAccounts

            // Update the net worth display
            updateNetWorthDisplay()
        } catch (error) {
            console.error('Failed to delete account:', error)
            alert('Failed to delete account. Please try again.')
        }
    }
}

// Function to remove an account from the UI
function removeAccountFromUI(accountId) {
    const accountElement = document.querySelector(`.account-item[data-account-id="${accountId}"]`)
    if (accountElement) {
        accountElement.remove()
    }
}

function addAccountToList(accountData) {
    // Add account to our tracking array
    accounts.push(accountData)

    const accountsContainer = document.getElementById('accounts-container')

    // Create account item element
    const accountItem = document.createElement('div')
    accountItem.className = 'account-item'
    accountItem.dataset.accountId = accountData.id // Store account ID in the DOM element

    // Create account name element
    const accountName = document.createElement('div')
    accountName.className = 'account-name'
    accountName.textContent = accountData.name

    // Create account balance element
    const accountBalance = document.createElement('div')
    accountBalance.className = 'account-balance'
    accountBalance.textContent = `Balance: $${accountData.balance.toFixed(2)}`

    // Create delete button
    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-button'
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', () => confirmDeleteAccount(accountData.id))

    // Add elements to account item
    accountItem.appendChild(accountName)
    accountItem.appendChild(accountBalance)
    accountItem.appendChild(deleteButton)

    // Add account item to accounts container
    accountsContainer.appendChild(accountItem)

    // Update the Net Worth display
    updateNetWorthDisplay()
}
