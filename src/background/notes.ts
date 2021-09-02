import { Note } from '@/shared/types'
import { readdirSync, readFileSync, statSync } from 'original-fs'
import { join } from 'path'

export default class Notes {
  static readFrom (path: string): Note[] | [] {
    return readdirSync(path).map((fileName) :Note => {
      const filePath = join(path, fileName)
      const content = readFileSync(filePath).toString()
      const stats = statSync(filePath)

      return {
        key: stats.birthtimeMs,
        datetime: stats.birthtime.toString(),
        content
      }
    })
  }
}
