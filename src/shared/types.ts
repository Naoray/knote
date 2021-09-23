import { Ref } from 'vue'

export interface Note {
  key: string
  datetime: string
  content: string
  fileName: string
}

export interface Notes {
  data: Ref<Note[]>
  currentNote: (key: string) => Note
  currentNoteContent: (key: string) => string
  removeNote: (key: string) => void
}
