import { createStore, Schema } from '@/shared/store'
import { app, App as ElectronApp, BrowserWindow, ipcMain } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import ElectronStore from 'electron-store'
import { serveMenu } from './menu'
import { Note } from '@/shared/types'
import { createWindowManager, Window } from './window'

interface fn {
  (): void;
}

export class App {
  electron: ElectronApp
  isDevelopment: boolean
  store: ElectronStore<Schema>
  windowManager?: Window

  notes: Note[]
  onAppReadyCallbacks: fn[]

  constructor (isDevelopment: boolean) {
    this.isDevelopment = isDevelopment
    this.store = createStore()
    this.electron = app

    this.notes = []
    this.onAppReadyCallbacks = []
  }

  send (channel: string, ...args: any[]): void {
    if (!this.windowManager) return

    this.windowManager.window.webContents.send(channel, ...args)
  }

  onAppReady (callback: fn): void {
    this.onAppReadyCallbacks.push(callback)
  }

  setupWindow (): void {
    this.windowManager = createWindowManager({
      minWidth: 1200,
      minHeight: 800,
      autoHideMenuBar: this.store.get('menuIsAlwaysHidden')
    })
  }

  serveMenu (): void {
    if (!this.windowManager) return

    serveMenu(this)
  }

  boot (): void {
    this.enableAppListener()

    // Exit cleanly on request from parent process in development mode.
    if (this.isDevelopment) {
      if (process.platform === 'win32') {
        process.on('message', data => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
  }

  enableAppListener ():void {
    this.electron.on('ready', () => {
      this.onAppReadyCallbacks.forEach(callback => (callback()))
    })

    // Quit when all windows are closed.
    this.electron.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        this.electron.quit()
      }
    })

    this.electron.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) this.setupWindow()
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
      if (this.isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
          await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
          console.error('Vue Devtools failed to install:', e.toString())
        }
      }

      this.setupWindow()
      this.serveMenu()
    })
  }
}
