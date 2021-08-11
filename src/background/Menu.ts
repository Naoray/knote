import { Menu, MenuItem } from 'electron'
import { Window } from './Window'

export const serveMenu = (windowManager: Window): void => {
  const template = [
    new MenuItem({ role: 'fileMenu' }),
    new MenuItem({ role: 'editMenu' }),
    new MenuItem({ role: 'viewMenu' }),
    new MenuItem({
      label: 'Window',
      submenu: [
        {
          label: 'Always Show Menu Bar',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            windowManager.window.setAutoHideMenuBar(!menuItem.checked)
            windowManager.window.setMenuBarVisibility(menuItem.checked)
          }
        }
      ]
    })
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
