import { app } from 'electron'
import { readFileSync, writeFileSync } from 'original-fs'
import { join } from 'path'

type StorageOptionsKey = 'menuIsAlwaysHidden'

interface StorageOptions {
  menuIsAlwaysHidden?: boolean
}

class Storage {
  path: string
  data: StorageOptions

  constructor (name: string, defaults: StorageOptions = {}) {
    const userDataPath = app.getPath('userData')

    this.path = join(userDataPath, name + '.json')
    this.data = this.parseConfigFile(defaults)
  }

  get<T extends keyof StorageOptions> (key: StorageOptionsKey): StorageOptions[T] {
    return this.data[key]
  }

  set<T extends StorageOptionsKey> (key: T, value: StorageOptions[T]): void {
    this.data[key] = value
    writeFileSync(this.path, JSON.stringify(this.data))
  }

  private parseConfigFile (defaults: StorageOptions): StorageOptions {
    try {
      return JSON.parse(readFileSync(this.path).toString())
    } catch (err) {
      return defaults
    }
  }
}

export default Storage
