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
    ping: () => ipcRenderer.invoke('ping')
})

console.log('preload.js loaded')
