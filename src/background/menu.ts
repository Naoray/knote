import { Menu, MenuItem } from 'electron'
import { App } from './app'
import Project from './project'

export const serveMenu = (app: App): void => {
  const template = [
    new MenuItem({
      role: 'fileMenu',
      submenu: [
        {
          label: 'Open Project',
          click: () => {
            app.notes = Project.new(app)
            app.send('openProject', app.notes[0])
          }
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: () => app.send('save')
        },
        { role: 'quit' }
      ]
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
              }
            },
            {
              label: 'Show Side Bar',
              type: 'checkbox',
              checked: true,
              accelerator: 'CommandOrControl+B',
              click: (menuItem) => app.send('appearanceChange', { item: 'showSidebar', value: menuItem.checked })
            }
          ]
        },
        {
          label: 'Editor',
          submenu: [
            {
              label: 'Show Rendered Markdown',
              accelerator: 'CommandOrControl+M',
              click: () => app.send('editorChange', { item: 'showRenderedMarkdown' })
            }
          ]
        },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    })
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
