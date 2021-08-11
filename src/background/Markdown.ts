import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'

export const htmlToMarkdown = (content: string): string => NodeHtmlMarkdown.translate(content)
