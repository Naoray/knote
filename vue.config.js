module.exports = {
  pages: {
    index: {
      entry: 'src/renderer/main.ts',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@components': '@/renderer/components',
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      mainProcessFile: 'src/background/main.ts',
      rendererProcessFile: 'src/renderer/main.ts',
      preload: 'src/preload.ts',
      removeElectronJunk: false,
      builderOptions: {
        publish: ['github'],
      },
    },
  },
}
