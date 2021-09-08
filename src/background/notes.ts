import { Note } from '@/shared/types'
import crypto from 'crypto'
import { readdirSync, readFileSync, statSync } from 'original-fs'
import { join } from 'path'

export default class Notes {
  static make(fileName: string, datetime: string, content = ''): Note {
    return {
      key: crypto
        .createHash('sha1')
        .update(fileName)
        .digest('hex'),
      datetime,
      content,
      fileName,
    }
  }

  static readFrom(path: string): Note[] | [] {
    return readdirSync(path).map(
      (fileName): Note => {
        const filePath = join(path, fileName)
        const content = readFileSync(filePath).toString()
        const stats = statSync(filePath)

        return this.make(fileName, stats.birthtime.toString(), content)
      },
    )
  }
}
