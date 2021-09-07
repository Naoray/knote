'use strict'

import { dialog, ipcMain, protocol } from 'electron'
import { App } from './app'
import { writeFile } from 'original-fs'
import Project from './project'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const app = new App(isDevelopment)

app.boot()

app.onAppReady(() => {
  ipcMain.on('appLoaded', (event) => {
    if (!app.store.has('projectRoot')) return

    app.notes = Project.new(app)
    event.reply('openProject', app.notes[0])
  })

  ipcMain.on('request-files', (event) => {
    event.reply('requested-files', app.notes)
  })

  ipcMain.on('save', (event, content) => {
    if (!app.windowManager) return

    const path = dialog.showSaveDialogSync(app.windowManager.window, {
      filters: [{ name: 'Markdown Files', extensions: ['md'] }],
    })

    if (path === undefined) {
      return
    }

    writeFile(path, content, (err) => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
  })

  ipcMain.on('openProject', (event) => {
    if (!app.windowManager) return

    app.notes = Project.new(app)

    event.reply('openProject', app.notes[0])
  })
})
