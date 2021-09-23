import { contextBridge, ipcRenderer } from 'electron'

const validChannels = [
  'request-files',
  'requested-files',
  'save',
  'updated',
  'openProject',
  'editorChange',
  'appearanceChange',
  'appLoaded',
  'newNote',
  'removeNote',
  'removedNote',
  'togglePresentMode',
  'rendererReady',
]

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, ...arg: Array<any>) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...arg)
    }
  },
  on: (channel: string, func: (...arg: Array<any>) => void) => {
    if (validChannels.includes(channel)) {
      // Strip event as it includes `sender` and is a security risk
      ipcRenderer.on(channel, (event, ...args: Array<string>) => func(...args))
    }
  },
})
