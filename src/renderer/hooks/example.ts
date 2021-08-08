import { ref, App, readonly, watch, computed, Ref, DeepReadonly, ComputedRef, provide, inject } from 'vue'

export interface CountState {
  count: DeepReadonly<Ref<number>>
  double: ComputedRef<number>
  set: (value: number) => void
  increment: () => void
  decrement: () => void
}

export const countSymbol = Symbol('count')

export const createCount = (): CountState => {
  const count = ref(0)

  // Do something when count changes.
  watch(count, (current) => {
    console.log('Count changed....', current)
  })

  return {
    count: readonly(count),
    double: computed(() => count.value * 2),
    set: (value: number) => (count.value = value),
    increment: () => count.value++,
    decrement: () => count.value--
  }
}

export const provideCount = () => provide<CountState>(countSymbol, createCount())
export const useCount = () => inject<CountState>(countSymbol)!
export default (app: App) => app.provide<CountState>(countSymbol, createCount())
