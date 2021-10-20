import { debounce as lodashDebounce } from 'lodash'

export const snakeCase = (word: string) =>
  word
    .split(' ')
    .reduce((acc, val: any) => {
      return acc.concat(val.toLowerCase())
    }, [])
    .join('_')

const DEFAULT_DEBOUNCE_WAIT_TIME = 350
export const debounce = <T extends (...args: any) => any>(func: T, wait = DEFAULT_DEBOUNCE_WAIT_TIME) =>
  lodashDebounce(func, wait)
