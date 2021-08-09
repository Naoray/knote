import { App, inject, provide, reactive } from 'vue'

export const notesSymbol = Symbol('notes')

interface Note {
  key: string,
  title: string,
  time: string,
  datetime: string,
  content: string
}

interface Notes {
  data: Note[]
}

export const createNotes = (): Notes => {
  return {
    data: reactive([
      {
        key: '1',
        title: 'Some notes',
        time: '1h ago',
        datetime: '2021-01-27T16:35',
        content:
        '<h1>Some notes</h1>test eres maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '2',
        title: 'Velit placeat sit ducimus non sed',
        time: '1d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '3',
        title: 'Lore',
        time: '2d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '4',
        title: 'OIther notes',
        time: '7d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Another maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '5',
        title: 'Velit placeat sit ducimus non sed',
        time: '14d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '6',
        title: 'Lore',
        time: '15d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '7',
        title: 'Ramen Noodles',
        time: '20d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed key d\'o\'lores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      },
      {
        key: '8',
        title: 'Test',
        time: '25d ago',
        datetime: '2021-01-27T16:35',
        content:
        'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
      }
    ])
  }
}

export const useNotes = () => inject<Notes>(notesSymbol)
export const provideNotes = () => provide<Notes>(notesSymbol, createNotes())
export default (app: App) => app.provide<Notes>(notesSymbol, createNotes())
