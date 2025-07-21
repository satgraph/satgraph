const {
    BrowserWindow,
    Menu,
    app,
    dialog,
    ipcMain,
} = require('electron')

const path = require("node:path")
// Import electron-store with default export
const Store = require('electron-store').default

// Initialize the store for account persistence
const store = new Store()

app.whenReady().then(() => {
    main()
})

function main() {
    const mainWindow = initMainWindow()
    initModalWindow(mainWindow)
    initMenu(mainWindow)
}

const initMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: pathTo('preload.js'),
        },
    })
    mainWindow.loadFile(pathTo('index.html'))
    return mainWindow
}

const initModalWindow = (mainWindow) => {
    const modalWindow = new BrowserWindow({
        width: 400,
        height: 300,
        parent: mainWindow,
        modal: true,
        show: false,
        webPreferences: {
            preload: pathTo('preload.js'),
        },
    })

    modalWindow.loadFile(pathTo('modal.html'))

    ipcMain.on('open-modal', () => {
        modalWindow.show()
    })

    ipcMain.on('close-modal', () => {
        modalWindow.hide()
    })

    ipcMain.on('submit-account', (event, accountData) => {
        // Forward the account data to the main window
        mainWindow.webContents.send('account-data', accountData)

        // Save the account data to the store
        const accounts = store.get('accounts', [])
        accounts.push(accountData)
        store.set('accounts', accounts)

        modalWindow.hide()
    })

    // Handle request to load accounts
    ipcMain.handle('load-accounts', () => {
        return store.get('accounts', [])
    })

    // Handle request to delete an account
    ipcMain.handle('delete-account', (event, accountId) => {
        const accounts = store.get('accounts', [])
        const updatedAccounts = accounts.filter(account => account.id !== accountId)
        store.set('accounts', updatedAccounts)
        // Return the updated accounts list
        return updatedAccounts
    })
}

const initMenu = (mainWindow) => {
    const template = [
        {
            label: 'App',
            submenu: [
                {
                    label: 'About Satgraph',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            title: 'About Satgraph',
                            message: 'Satgraph',
                            detail: `This app is using Chrome (v${process.versions.chrome}), ` +
                                `Node.js (v${process.versions.node}), ` +
                                `and Electron (v${process.versions.electron})`,
                            buttons: ['OK'],
                            type: 'info',
                        })
                    },
                },
                {type: 'separator'},
                {role: 'quit'},
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Option+I',
                    click: (_, window) => {
                        if (window) window.webContents.toggleDevTools()
                    },
                },
            ],
        },
        {
            label: 'Accounts',
            submenu: [
                {
                    label: 'Add Account...',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        initModalWindow(mainWindow)
                    },
                },
            ],
        },
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
const pathTo = filename => path.join(__dirname, filename)

