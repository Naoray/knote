import { App, inject, provide, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'

export const notesSymbol = Symbol('notes')

interface Note {
  key: string,
  title: string,
  time: string,
  datetime: string,
  content: string
}

interface Notes {
  data: Ref<Note[]>,
  currentNote: (key: string|number) => Note
}

export const createNotes = (): Notes => {
  const data = ref<Note[]>([])

  window.ipc.on('requested-files', (notes: Note[]) => {
    data.value = notes
  })

  window.ipc.send('request-files')

  return {
    data,
    currentNote: (key: string|number) => data.value.find(item => item.key === key)!
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export const provideNotes = () => provide<Notes>(notesSymbol, createNotes())
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
