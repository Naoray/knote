import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { join } from 'path'
import { BrowserWindowConstructorOptions } from 'electron/main'
import { autoUpdater } from 'electron-updater'

export class Window {
  window: BrowserWindow

  constructor(options: BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow({
      ...options,
      webPreferences: {
        // Use pluginOptions.nodeIntegration, leave this alone
        // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
        nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        preload: join(__dirname, 'preload.js'),
        spellcheck: false,
      },
    })
  }

  async load(): Promise<void> {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
      if (!process.env.IS_TEST) this.window.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      this.window.loadURL('app://./index.html')

      autoUpdater.checkForUpdatesAndNotify()
    }
  }
}

export const createWindowManager = async (options: BrowserWindowConstructorOptions): Promise<Window> => {
  const manager = new Window(options)
  await manager.load()
  return manager
}
