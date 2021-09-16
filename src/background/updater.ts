import { autoUpdater, AppUpdater as ElectronUpdater } from 'electron-updater'
import Logger from 'electron-log'
import { dialog } from 'electron'

export default class AppUpdater {
  private updater: ElectronUpdater

  constructor() {
    this.updater = autoUpdater

    this.setup()
    this.listenForEvents()
  }

  setup() {
    this.updater.logger = Logger

    this.updater.allowPrerelease = true
    this.updater.autoInstallOnAppQuit = false
    this.updater.fullChangelog = true
    this.updater.autoDownload = false
  }

  listenForEvents() {
    autoUpdater.on('checking-for-update', () => {
      // your code here
    })

    autoUpdater.on('update-available', (info) => {
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
  }

  checkForUpdates() {
    this.updater.checkForUpdates()
  }
}
