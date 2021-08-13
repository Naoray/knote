import { markdownToHtml } from '@/shared/Markdown'
import { App, inject, provide, Ref, ref } from 'vue'

export const notesSymbol = Symbol('notes')

interface Note {
  key: string,
  title: string,
  time: string,
  datetime: string,
  content: {
    markdown: string,
    html?: string
  }
}

interface Notes {
  data: Ref<Note[]>,
  currentNoteContent: (key: string|number) => string
}

export const createNotes = (): Notes => {
  const data = ref<Note[]>([])

  window.ipc.on('requested-files', (notes: Note[]) => {
    data.value = notes.map(note => {
      note.content.html = markdownToHtml(note.content.markdown)
      return note
    })
  })

  window.ipc.send('request-files')

  return {
    data,
    currentNoteContent: (key: string|number): string => {
      const note = data.value.find(item => item.key === key)!

      if (note === undefined || note.content === undefined || note.content.html === undefined) {
        return ''
      }

      return note.content.html
    }
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export const provideNotes = () => provide<Notes>(notesSymbol, createNotes())
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
