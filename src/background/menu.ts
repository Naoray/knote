import { Menu, MenuItem } from 'electron'
import { App } from './app'
import Project from './project'
import Notes from './notes'
import { autoUpdater } from 'electron-updater'

export const serveMenu = (app: App): void => {
  const template = [
    new MenuItem({
      role: 'fileMenu',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CommandOrControl+N',
          click: () => {
            const newNote = Notes.make('', new Date().toString())
            app.notes.push(newNote)
            app.send('requested-files', app.notes)
            app.send('newNote', newNote)
          },
        },
        { type: 'separator' },
        {
          label: 'Open Project',
          click: () => {
            app.notes = Project.make(app)
            app.send('openProject', app.notes[0])
          },
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: () => app.send('save'),
        },
        { role: 'quit' },
      ],
    }),
    new MenuItem({ role: 'editMenu' }),
    new MenuItem({
      role: 'viewMenu',
      submenu: [
        {
          label: 'Appearance',
          submenu: [
            {
              label: 'Always Show Menu Bar',
              type: 'checkbox',
              checked: !app.store.get('menuIsAlwaysHidden'),
              click: (menuItem) => {
                if (!app.windowManager) return
                app.windowManager.window.setAutoHideMenuBar(!menuItem.checked)
                app.windowManager.window.setMenuBarVisibility(menuItem.checked)
                app.store.set('menuIsAlwaysHidden', !menuItem.checked)
              },
            },
            {
              label: 'Show Side Bar',
              type: 'checkbox',
              checked: true,
              accelerator: 'CommandOrControl+B',
              click: (menuItem) => app.send('appearanceChange', { item: 'showSidebar', value: menuItem.checked }),
            },
          ],
        },
        {
          label: 'Editor',
          submenu: [
            {
              label: 'Show Rendered Markdown',
              accelerator: 'CommandOrControl+M',
              click: () => app.send('editorChange', { item: 'showRenderedMarkdown' }),
            },
          ],
        },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    }),
    new MenuItem({
      label: 'About',
      submenu: [
        {
          label: 'Check for Updates',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify().then(console.log)
          },
        },
      ],
    }),
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
