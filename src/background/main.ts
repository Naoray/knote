'use strict'

import { dialog, ipcMain, protocol } from 'electron'
import { App } from './app'
import { writeFile } from 'original-fs'
import { join } from 'path'
import Project from './project'
import Notes from './notes'
import logger from 'electron-log'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const app = new App(isDevelopment)

app.boot()

app.onAppReady(() => {
  ipcMain.on('rendererReady', () => {
    if (!app.store.has('projectRoot')) return

    app.notes = Notes.readFrom(app.store.get('projectRoot'))
    app.send('openProject', app.notes[0])
  })

  ipcMain.on('request-files', (event) => {
    event.reply('requested-files', app.notes)
  })

  ipcMain.on('save', (event, note) => {
    if (!app.windowManager) return

    if (note.fileName !== '') {
      const path = join(app.store.get('projectRoot'), note.fileName)
      return writeFile(path, note.content, (err) => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
    }

    const path = dialog.showSaveDialogSync(app.windowManager.window, {
      defaultPath: app.store.get('projectRoot'),
      filters: [{ name: 'Markdown Files', extensions: ['md'] }],
    })

    if (path === undefined) {
      return
    }

    writeFile(path, note.content, (err) => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
  })

  ipcMain.on('openProject', (event) => {
    if (!app.windowManager) return

    app.notes = Project.make(app)

    event.reply('openProject', app.notes[0])
  })
})
