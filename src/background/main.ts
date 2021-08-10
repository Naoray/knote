'use strict'

import { app, protocol, BrowserWindow, Menu, MenuItem, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { join } from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

function createMenu () {
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
            win.setAutoHideMenuBar(!menuItem.checked)
            win.setMenuBarVisibility(menuItem.checked)
          }
        }
      ]
    })
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createMenu()

  ipcMain.on('request-files', (event) => {
    event.reply('requested-files', [
      {
        key: '1',
        title: 'Some notes',
        time: '1h ago',
        datetime: '2021-01-27T16:35',
        content:
        '<h1>Some notes</h1>test eres maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '2',
        title: 'Velit placeat sit ducimus non sed',
        time: '1d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '3',
        title: 'Lore',
        time: '2d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '4',
        title: 'OIther notes',
        time: '7d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Another maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '5',
        title: 'Velit placeat sit ducimus non sed',
        time: '14d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '6',
        title: 'Lore',
        time: '15d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '7',
        title: 'Ramen Noodles',
        time: '20d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '8',
        title: 'Test',
        time: '25d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      }
    ])
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
