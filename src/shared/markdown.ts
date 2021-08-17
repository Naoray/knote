import { NodeHtmlMarkdown } from 'node-html-markdown'
import MarkdownIt from 'markdown-it'

let markdownIt: MarkdownIt

export const htmlToMarkdown = (content: string): string => NodeHtmlMarkdown.translate(content)

export const markdownToHtml = (content: string): string => {
  if (!markdownIt) {
    markdownIt = new MarkdownIt()
  }

  return markdownIt.render(content)
}
