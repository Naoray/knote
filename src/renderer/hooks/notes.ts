import { Note, Notes } from '@/shared/types'
import { App, inject, ref } from 'vue'

const notesSymbol = Symbol('notes')

const createNotes = (): Notes => {
  const data = ref<Note[]>([])

  window.ipc.on('requested-files', (notes: Note[]) => (data.value = notes))

  return {
    data,
    currentNoteContent: (key: string): string => {
      const note = data.value.find(item => String(item.key) === key)!

      if (!note) return ''
      return note.content
    }
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
