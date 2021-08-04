module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@components': '@/renderer/components'
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background/main.ts',
      rendererProcessFile: 'src/renderer/main.ts',
      preload: 'src/preload.ts',
      builderOptions: {
        nodeIntegration: false
      }
    }
  }
}
