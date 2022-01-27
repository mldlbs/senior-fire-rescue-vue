const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'build/dist',
  assetsDir: 'static',
  css: {
    loaderOptions: {
      sass: {
        // prependData: '@import "~@/globals.scss";'
      },
      scss: {
        // prependData: '@import "~@/globals.scss";'
      }
    }
  },
  configureWebpack: {
    name: '流程编辑',
    resolve: {
      alias: {
        // vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src')
      },
      extensions: ['.js', '.vue', '.json', '.css', '.node']
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  chainWebpack: (config) => {
    /** 删除懒加载模块的 prefetch preload，降低带宽压力(使用在移动端) */
    config.plugins.delete('prefetch').delete('preload')
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.plugin('define').tap((args) => {
      Object.assign(args[0], {
        VFE_VERSION: JSON.stringify(require('./package.json').version)
      })
      return args
    })

    config.resolve.alias
      .set('utils', path.resolve(__dirname, 'utils'))
  }
}
