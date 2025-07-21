const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron')
const path = require("node:path");

const createWindow = () => {
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

function createMenu(mainWindow) {
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
                            detail: `This app is using Chrome (v${process.versions.chrome}), Node.js (v${process.versions.node}), and Electron (v${process.versions.electron})`,
                            buttons: ['OK'],
                            type: 'info'
                        })
                    }
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    const mainWindow = createWindow()
    createMenu(mainWindow)
})