'use strict'

import { dialog, ipcMain, protocol } from 'electron'
import { App } from './app'
import { writeFile } from 'original-fs'
import { Note } from '@/shared/types'
import Notes from './notes'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let notes: Note[]

const app = new App(isDevelopment)

app.boot()

app.onAppReady(() => {
  ipcMain.on('appLoaded', (event) => {
    if (!app.store.has('projectRoot')) return

    notes = Notes.readFrom(app.store.get('projectRoot'))
    event.reply('openProject', notes[0])
  })

  ipcMain.on('request-files', (event) => {
    event.reply('requested-files', notes)
  })

  ipcMain.on('save', (event, content) => {
    if (!app.windowManager) return

    const path = dialog.showSaveDialogSync(app.windowManager.window, {
      filters: [
        { name: 'Markdown Files', extensions: ['md'] }
      ]
    })

    if (path === undefined) {
      return
    }

    writeFile(path, content, err => err && dialog.showErrorBox('Saving unsuccessful', err.stack!))
  })

  ipcMain.on('openProject', event => {
    if (!app.windowManager) return

    const projectPath = dialog.showOpenDialogSync(app.windowManager.window, {
      defaultPath: app.store.get('projectRoot'),
      properties: ['openDirectory', 'createDirectory']
    })

    if (projectPath === undefined) {
      return
    }

    const selectedPath: string = projectPath[0]
    app.store.set('projectRoot', selectedPath)

    notes = Notes.readFrom(selectedPath)

    event.reply('openProject', notes[0])
  })
})
