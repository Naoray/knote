module.exports = {
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
