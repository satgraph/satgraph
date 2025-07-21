const {
    contextBridge,
    ipcRenderer,
} = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('services', {
    send: (channel) => ipcRenderer.send(channel),
    sendData: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (_, data) => callback(data)),
})
