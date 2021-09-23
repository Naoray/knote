'use strict'

import { dialog, ipcMain, protocol } from 'electron'
import { App } from './app'
import { unlink, writeFile } from 'original-fs'
import { join, basename } from 'path'
import Project from './project'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const app = new App(isDevelopment)

app.boot()

app.onAppReady(() => {
  ipcMain.on('rendererReady', () => {
    app.rendererReady = true
    app.loadLastProject()
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

    app.notes = app.notes.map((noteItem) => {
      if (noteItem.key === note.key) {
        note.fileName = basename(path)
      }

      return note
    })

    event.reply('updated', note)

    writeFile(path, note.content, (err) => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
  })

  ipcMain.on('removedNote', (event, note) => {
    // remove note from app.notes
    app.notes = app.notes.filter((item) => item.key !== note.key)

    // delete file from filesystem
    unlink(join(app.store.get('projectRoot'), note.fileName), (err) => console.log(err))
  })

  ipcMain.on('openProject', (event) => {
    if (!app.windowManager) return

    app.notes = Project.make(app)

    event.reply('openProject', app.notes[0])
  })
})
