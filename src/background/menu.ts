import { dialog, Menu, MenuItem } from 'electron'
import { App } from './app'
import Project from './project'
import Notes from './notes'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'

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
            autoUpdater.logger = logger
            autoUpdater.allowPrerelease = true
            autoUpdater.autoInstallOnAppQuit = false
            autoUpdater.fullChangelog = true
            autoUpdater.autoDownload = false

            autoUpdater.on('checking-for-update', () => {
              // your code here
            })

            autoUpdater.on('update-available', (info) => {
              logger.info(info)
              dialog
                .showMessageBox({
                  type: 'info',
                  title: 'Found Updates',
                  message: `New updates are available, do you want update to version ${info.releaseName} now?`,
                  defaultId: 0,
                  cancelId: 1,
                  buttons: ['Yes', 'No'],
                })
                .then((result) => {
                  if (result.response === 0) {
                    autoUpdater.downloadUpdate()
                  }
                })
            })

            autoUpdater.on('update-not-available', (info) => {
              dialog.showMessageBox({
                title: 'No Updates',
                message: `Current version (${autoUpdater.currentVersion}) is up-to-date.`,
              })
            })

            autoUpdater.on('update-downloaded', (info) => {
              dialog
                .showMessageBox({
                  title: 'Install Updates',
                  message: 'Updates are ready to be installed.',
                  defaultId: 0,
                  cancelId: 1,
                  buttons: ['Install and restart', 'Close'],
                })
                .then((result) => {
                  if (result.response === 0) {
                    setImmediate(() => autoUpdater.quitAndInstall())
                  }
                })
            })

            autoUpdater.checkForUpdates()
          },
        },
      ],
    }),
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
