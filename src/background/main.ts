'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { readdirSync, writeFile } from 'original-fs'
import { htmlToMarkdown } from '../shared/Markdown'
import { serveMenu } from './menu'
import { createWindowManager, Window } from './window'
import Store from 'electron-store'
const isDevelopment = process.env.NODE_ENV !== 'production'

let windowManager: Window
const store = new Store()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  windowManager = createWindowManager({
    minWidth: 1200,
    minHeight: 800,
    autoHideMenuBar: !!store.get('menuIsAlwaysHidden') || false
  })
}

function createMenu () {
  if (windowManager) {
    serveMenu(windowManager, store)
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createMenu()

  ipcMain.on('request-files', (event) => {
    event.reply('requested-files', [])
  })

  ipcMain.on('save', (event, content) => {
    const path = dialog.showSaveDialogSync(windowManager.window, {
      filters: [
        { name: 'Markdown Files', extensions: ['md'] }
      ]
    })

    if (path === undefined) {
      return
    }

    writeFile(path, htmlToMarkdown(content), err => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
  })

  ipcMain.on('openProject', event => {
    const projectPath = dialog.showOpenDialogSync(windowManager.window, {
      defaultPath: '~/',
      properties: ['openDirectory', 'createDirectory']
    })

    if (projectPath === undefined) {
      return
    }

    console.log(readdirSync(projectPath[0]))
    event.reply('openProject', projectPath)
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
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
