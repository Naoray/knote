import MarkdownIt, { Options, PresetName } from 'markdown-it'

export class Markdown {
  private markdownIt: MarkdownIt

  constructor(preset: PresetName = 'default', options?: Options) {
    this.markdownIt = new MarkdownIt(preset, options)
  }

  toHtml(content: string): string {
    return this.markdownIt.render(content)
  }

  extractTitle(content: string): string {
    const headingMatch = /^#+(.*)$/
    const linesWithText = content.split('\n').filter((line) => line.length > 0)

    if (linesWithText.length === 0) return 'No Content'

    const match = linesWithText[0].match(headingMatch)
    if (match == null) return 'No Content'

    return (match && match[1]).trim()
  }

  contentWithoutTitle(content: string): string {
    const title = this.extractTitle(content)

    return content.replace(new RegExp(title, 'g'), '')
  }
}

export const createMarkdown = (preset: PresetName, options?: Options): Markdown => {
  const markdown = new Markdown(preset, options)

  return markdown
}
