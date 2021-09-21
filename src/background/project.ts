import { Note } from '@/shared/types'
import { dialog } from 'electron'
import { App } from './app'
import Notes from './notes'

export default class Project {
  static make(app: App): Note[] {
    if (!app.windowManager) return []

    const projectPath = dialog.showOpenDialogSync(app.windowManager.window, {
      defaultPath: app.store.get('projectRoot'),
      properties: ['openDirectory', 'createDirectory'],
    })

    if (projectPath === undefined) {
      return []
    }

    const selectedPath: string = projectPath[0]
    app.store.set('projectRoot', selectedPath)

    return Notes.readFrom(selectedPath)
  }

  static load(app: App): void {
    app.notes = Notes.readFrom(app.store.get('projectRoot'))
    app.send('openProject', app.notes[0])
  }
}
