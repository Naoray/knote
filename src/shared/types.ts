import { Ref } from 'vue'

export interface Note {
  key: string,
  datetime: string,
  content: string,
}

export interface Notes {
  data: Ref<Note[]>,
  currentNoteContent: (key: string) => string
}
