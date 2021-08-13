'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { htmlToMarkdown } from '../shared/Markdown'
import { serveMenu } from './Menu'
import { createWindowManager, Window } from './Window'
const isDevelopment = process.env.NODE_ENV !== 'production'

let windowManager: Window

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  windowManager = createWindowManager({
    minWidth: 1200,
    minHeight: 800
  })
}

function createMenu () {
  if (windowManager) {
    serveMenu(windowManager)
  }
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
        content: {
          markdown:
          '# Some notes\ntest eres maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '2',
        title: 'Velit placeat sit ducimus non sed',
        time: '1d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
          'DBas asa dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '3',
        title: 'Lore',
        time: '2d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
          'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '4',
        title: 'OIther notes',
        time: '7d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
            'Another maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '5',
        title: 'Velit placeat sit ducimus non sed',
        time: '14d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
            'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '6',
        title: 'Lore',
        time: '15d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
          'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '7',
        title: 'Ramen Noodles',
        time: '20d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
            'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      },
      {
        key: '8',
        title: 'Test',
        time: '25d ago',
        datetime: '2021-01-27T16:35',
        content: {
          markdown:
          'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.',
          html: undefined
        }
      }
    ])
  })

  ipcMain.on('save', (event, content) => {
    event.reply('saved', htmlToMarkdown(content))
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
