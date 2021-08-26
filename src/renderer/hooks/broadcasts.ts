import { App, inject, reactive, UnwrapRef } from 'vue'

type BroadcastEditorOptions = 'showRenderedMarkdown'

export interface BroadcastEditorObject {
  item: BroadcastEditorOptions
}

type AppearanceOptions = 'showSidebar'

export interface BroadcastAppearanceObject {
  item: AppearanceOptions
  value: boolean
}

export interface Broadcasts {
  editor: UnwrapRef<{
    showRenderedMarkdown: boolean
  }>,
  appearance: UnwrapRef<{
    showSidebar: boolean
  }>
}

const broadcastSymbol = Symbol('broadcast')

const createBroadcasts = () : Broadcasts => {
  const editor = reactive({
    showRenderedMarkdown: false
  })

  window.ipc.on('editorChange', ({ item }: BroadcastEditorObject) => {
    editor[item] = !editor[item]
  })

  const appearance = reactive({
    showSidebar: true
  })

  window.ipc.on('appearanceChange', ({ item, value }: BroadcastAppearanceObject) => {
    appearance[item] = value as boolean
  })

  return {
    editor,
    appearance
  }
}

export const useBroadcasts = () => inject<Broadcasts>(broadcastSymbol)
export default (app: App) => app.provide<Broadcasts>(broadcastSymbol, createBroadcasts())
