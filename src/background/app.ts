import { createStore, Schema } from '@/shared/store'
import { app, App as ElectronApp, BrowserWindow } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import ElectronStore from 'electron-store'
import { serveMenu as setupMenu } from './menu'
import { Note } from '@/shared/types'
import { createWindowManager, Window } from './window'
import AppUpdater from './updater'
import Project from './project'
import { IpcMainEvent } from 'electron/main'
import { basename } from 'path'
import { createMarkdown, Markdown } from '@/shared/markdown'
interface fn {
  (): void
}

export class App {
  electron: ElectronApp
  updater: AppUpdater
  isDevelopment: boolean
  store: ElectronStore<Schema>
  windowManager?: Window

  markdown: Markdown

  rendererReady = false
  windowReady = false

  notes: Note[] = []
  onAppReadyCallbacks: fn[] = []

  constructor(isDevelopment: boolean) {
    this.isDevelopment = isDevelopment
    this.store = createStore()
    this.electron = app
    this.updater = new AppUpdater()

    this.markdown = createMarkdown('default', {
      html: true,
      linkify: true,
      breaks: true,
      typographer: true,
    })
  }

  send(channel: string, ...args: any[]): void {
    if (!this.windowManager) return
    this.windowManager.window.webContents.send(channel, ...args)
  }

  loadLastProject(): void {
    if (!this.windowReady || !this.rendererReady || !this.store.has('projectRoot')) return

    Project.load(this)
  }

  updateNotes(note: Note, path: string, event: IpcMainEvent) {
    this.notes = this.notes.map((noteItem) => {
      if (noteItem.key === note.key) {
        note.fileName = basename(path)
      }

      return note
    })

    event.reply('updated', note)
  }

  onAppReady(callback: fn): void {
    this.onAppReadyCallbacks.push(callback)
  }

  async setupWindow(): Promise<void> {
    this.windowManager = await createWindowManager({
      minWidth: 1200,
      minHeight: 800,
      autoHideMenuBar: this.store.get('menuIsAlwaysHidden'),
    })

    this.updater.checkForUpdates()
    this.windowReady = true
    this.loadLastProject()
  }

  serveMenu(): void {
    setupMenu(this)
  }

  boot(): void {
    this.enableAppListener()

    // Exit cleanly on request from parent process in development mode.
    if (this.isDevelopment) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
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

  enableAppListener(): void {
    this.electron.on('ready', () => {
      this.onAppReadyCallbacks.forEach((callback) => callback())
    })

    // Quit when all windows are closed.
    this.electron.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        this.electron.quit()
      }
    })

    this.electron.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) await this.setupWindow()
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
      if (this.isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        await installExtension(VUEJS3_DEVTOOLS).catch((e) =>
          console.error('Vue Devtools failed to install:', e.toString()),
        )
      }

      await this.setupWindow()
      this.serveMenu()
    })
  }
}
