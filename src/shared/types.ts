import { Ref } from 'vue'

export interface Note {
  key: number,
  datetime: string,
  markdown: string,
  html: string
}

export interface Notes {
  data: Ref<Note[]>,
  currentNoteContent: (key: string) => string
}
