import { Note, Notes } from '@/shared/types'
import { App, inject, provide, ref } from 'vue'

export const notesSymbol = Symbol('notes')

export const createNotes = (): Notes => {
  const data = ref<Note[]>([])

  window.ipc.on('requested-files', (notes: Note[]) => {
    data.value = notes
  })

  window.ipc.send('request-files')

  return {
    data,
    currentNoteContent: (key: string): string => {
      const note = data.value.find(item => String(item.key) === key)!

      return note.html
    }
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export const provideNotes = () => provide<Notes>(notesSymbol, createNotes())
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
