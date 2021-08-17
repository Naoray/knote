import Store from 'electron-store'

export interface Schema {
  projectRoot: string,
  menuIsAlwaysHidden: boolean
}

export const createStore = (): Store<Schema> => {
  return new Store<Schema>({
    defaults: {
      projectRoot: '~/',
      menuIsAlwaysHidden: false
    }
  })
}
