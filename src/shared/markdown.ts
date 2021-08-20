import MarkdownIt, { Options, PresetName } from 'markdown-it'

class Markdown {
  private markdownIt: MarkdownIt

  constructor (preset: PresetName, options?: Options) {
    this.markdownIt = new MarkdownIt(preset, options)
  }

  toHtml (content: string): string {
    return this.markdownIt.render(content)
  }
}

export const createMarkdown = (preset: PresetName, options?: Options): Markdown => {
  const markdown = new Markdown(preset, options)

  return markdown
}
