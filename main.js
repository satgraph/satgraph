const {
    BrowserWindow,
    Menu,
    app,
    dialog,
    ipcMain,
} = require('electron')
const path = require("node:path")

const createMainWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
    return win
}

const createMenu = (mainWindow) => {
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
                            type: 'info'
                        })
                    }
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Option+I',
                    click: (_, window) => {
                        if (window) window.webContents.toggleDevTools()
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    const mainWindow = createMainWindow()
    createMenu(mainWindow)
})