import { App, inject, reactive, UnwrapRef } from 'vue'
export interface BroadcastEditorObject {
  item: 'showRenderedMarkdown'
}

export interface BroadcastAppearanceObject {
  item: 'showSidebar'
  value: boolean
}

export interface BroadcastSettingObject {
  item: 'enableAutosaving'
}

export interface Broadcasts {
  editor: UnwrapRef<{ showRenderedMarkdown: boolean }>
  appearance: UnwrapRef<{ showSidebar: boolean }>
  settings: UnwrapRef<{ enableAutosaving: boolean }>
}

const broadcastSymbol = Symbol('broadcast')

const createBroadcasts = (): Broadcasts => {
  const editor = reactive({
    showRenderedMarkdown: false,
  })

  window.ipc.on('editorChange', ({ item }: BroadcastEditorObject) => {
    editor[item] = !editor[item]
  })

  const appearance = reactive({
    showSidebar: true,
  })

  window.ipc.on('appearanceChange', ({ item, value }: BroadcastAppearanceObject) => {
    appearance[item] = value as boolean
  })

  const settings = reactive({
    enableAutosaving: false,
  })

  window.ipc.on('settingChange', ({ item }: BroadcastSettingObject) => {
    settings[item] = !settings[item]
  })

  return {
    editor,
    appearance,
    settings,
  }
}

export const useBroadcasts = () => inject<Broadcasts>(broadcastSymbol)
export default (app: App) => app.provide<Broadcasts>(broadcastSymbol, createBroadcasts())
