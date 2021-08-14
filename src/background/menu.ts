import { Menu, MenuItem } from 'electron'
import Storage from './storage'
import { Window } from './window'

export const serveMenu = (windowManager: Window, storage: Storage): void => {
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
          checked: !storage.get('menuIsAlwaysHidden'),
          click: (menuItem) => {
            windowManager.window.setAutoHideMenuBar(!menuItem.checked)
            windowManager.window.setMenuBarVisibility(menuItem.checked)
            storage.set('menuIsAlwaysHidden', !menuItem.checked)
          }
        }
      ]
    })
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
