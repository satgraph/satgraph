document.getElementById('close-modal-button').addEventListener('click', () => {
    closeModal()
})

document.getElementById('account-form').addEventListener('submit', (event) => {
    event.preventDefault()
    submitAccount()
})

function closeModal() {
    window.services.send('close-modal')
}

function submitAccount() {
    const accountName = document.getElementById('account-name').value
    const accountBalance = document.getElementById('account-balance').value

    if (!accountName || !accountBalance) {
        alert('Please fill in all fields')
        return
    }

    const accountData = {
        id: Date.now().toString(), // Add a unique identifier using timestamp
        name: accountName,
        balance: parseFloat(accountBalance)
    }

    window.services.sendData('submit-account', accountData)
    closeModal()
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        // Send IPC message to the main process to close the modal
        window.services.send('close-modal')
    }
})