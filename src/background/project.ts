import { Note } from '@/shared/types'
import { dialog } from 'electron'
import { App } from './app'
import Notes from './notes'

export default class Project {
  static new (app: App): Note[] {
    if (!app.windowManager) return []

    const projectPath = dialog.showOpenDialogSync(app.windowManager.window, {
      defaultPath: app.store.get('projectRoot'),
      properties: ['openDirectory', 'createDirectory']
    })

    if (projectPath === undefined) {
      return []
    }

    const selectedPath: string = projectPath[0]
    app.store.set('projectRoot', selectedPath)

    return Notes.readFrom(selectedPath)
  }
}
