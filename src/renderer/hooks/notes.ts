import { Note, Notes } from '@/shared/types'
import { App, inject, ref } from 'vue'

const notesSymbol = Symbol('notes')

const createNotes = (): Notes => {
  const data = ref<Note[]>([])

  window.ipc.on('requested-files', (notes: Note[]) => (data.value = notes))

  const currentNote = (key: string): Note => data.value.find((item) => String(item.key) === key)!

  return {
    data,
    currentNote,
    currentNoteContent: (key: string): string => {
      const note = currentNote(key)

      if (!note) return ''
      return note.content
    },
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
