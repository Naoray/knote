import { createMarkdown } from '@/shared/markdown'
import { App, inject } from 'vue'

const markdownSymbol = Symbol('markdown')

interface MarkdownData {
  toHtml: (content: string) => string
  extractTitle: (content: string) => string
  contentWithoutTitle: (content: string) => string
}

const createMarkdownData = (): MarkdownData => {
  const markdown = createMarkdown('default', {
    html: true,
    linkify: true,
    breaks: true,
    typographer: true,
  })

  return {
    toHtml: (content: string) => markdown.toHtml(content),
    extractTitle: (content: string) => markdown.extractTitle(content),
    contentWithoutTitle: (content: string) => markdown.contentWithoutTitle(content),
  }
}

export const useMarkdown = () => inject<MarkdownData>(markdownSymbol)
export default (app: App) => app.provide<MarkdownData>(markdownSymbol, createMarkdownData())
