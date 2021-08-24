import { contextBridge, ipcRenderer } from 'electron'

const validChannels = ['request-files', 'requested-files', 'save', 'openProject', 'toggleRenderedMarkdown']

contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel: string, data?: string) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel: string, func: (...arg: Array<string>) => void) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args: Array<string>) => func(...args))
      }
    }
  }
)
