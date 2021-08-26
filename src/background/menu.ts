import { Schema } from '@/shared/store'
import { Menu, MenuItem } from 'electron'
import Store from 'electron-store'
import { Window } from './window'

export const serveMenu = (windowManager: Window, store: Store<Schema>): void => {
  const template = [
    new MenuItem({
      role: 'fileMenu',
      submenu: [
        { role: 'quit' },
        {
          label: 'Save',
          accelerator: 'CommandOrControl+S',
          click: () => windowManager.window.webContents.send('save')
        }
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
              checked: !store.get('menuIsAlwaysHidden'),
              click: (menuItem) => {
                windowManager.window.setAutoHideMenuBar(!menuItem.checked)
                windowManager.window.setMenuBarVisibility(menuItem.checked)
                store.set('menuIsAlwaysHidden', !menuItem.checked)
              }
            },
            {
              label: 'Show Side Bar',
              type: 'checkbox',
              checked: true,
              accelerator: 'CommandOrControl+B',
              click: (menuItem) => windowManager.window.webContents.send('appearanceChange', { item: 'showSidebar', value: menuItem.checked })
            }
          ]
        },
        {
          label: 'Editor',
          submenu: [
            {
              label: 'Show Rendered Markdown',
              accelerator: 'CommandOrControl+M',
              click: () => windowManager.window.webContents.send('editorChange', { item: 'showRenderedMarkdown' })
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
