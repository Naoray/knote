import { Note } from '@/shared/types'
import Crypto from 'crypto'
import { readdirSync, readFileSync, statSync } from 'original-fs'
import { join } from 'path'

export default class Notes {
  static make(fileName: string, datetime: string, content = ''): Note {
    return {
      key: Crypto.randomBytes(32)
        .toString('base64')
        .slice(0, 32),
      datetime,
      content,
      fileName,
    }
  }

  static readFrom(path: string, withEmptyNote = false): Note[] | [] {
    const notes = readdirSync(path).map(
      (fileName): Note => {
        const filePath = join(path, fileName)
        const content = readFileSync(filePath).toString()
        const stats = statSync(filePath)

        return this.make(fileName, stats.birthtime.toString(), content)
      },
    )

    if (!withEmptyNote) return notes

    return notes.length ? notes : [Notes.make('', new Date().toString())]
  }
}
