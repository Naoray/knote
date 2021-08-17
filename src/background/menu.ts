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
          click: () => {
            windowManager.window.webContents.send('save')
          }
        }
      ]
    }),
    new MenuItem({ role: 'editMenu' }),
    new MenuItem({ role: 'viewMenu' }),
    new MenuItem({
      label: 'Window',
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
        }
      ]
    })
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
