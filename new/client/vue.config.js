var path = require('path')
var StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: true,

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // split vendors using autoDLLPlugin?
  // can also be an explicit Array of dependencies to include in the DLL chunk.
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode

  // configure webpack-dev-server behavior
  // devServer: {
  //   historyApiFallback: false,
  //   hot: true,
  //   inline: true,
  //   stats: {
  //     colors: true
  //   },
  //   // open: process.platform === 'darwin',
  //   // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
  //   proxy: {
  //     '/api': {
  //       target: 'http://172.16.40.19:8070/', // http://devadmin.whaletrip.com    http://release.whaletrip.com
  //       pathRewrite: {
  //         '^/api/': '/'
  //       },
  //       changeOrigin: true
  //     }
  //   }
  // },

  // configureWebpack: config => {
  //   // config.module.rules[0] = merge(config.module.rules[0], {
  //   //   test: /\.vue$/,
  //   //   use: [
  //   //     {
  //   //       loader: 'iview-loader',
  //   //       options: {
  //   //         prefix: true
  //   //       }
  //   //     }
  //   //   ]
  //   // })
  //   // console.log(config.module.rules[0].use)
  // },

  chainWebpack: config => {
    config.resolve.alias.set(
      'components',
      path.resolve(__dirname, './src/components')
    )
    // config.module
    //   .rule('vue')
    //   .test(/\.vue$/)
    //   .use()
    //   .loader('iview-loader')
    //   .options({
    //     prefix: true
    //   })
    config.module
      .rule('yaml')
      .test(/(\.yaml|\.yml)$/)
      .use()
      .loader('yml-loader')
    //
    // config.plugin('stylelint').use(StyleLintPlugin, [
    //   {
    //     context: 'src',
    //     files: ['**/*.?(*ss|vue)']
    //   }
    // ])
  }
}
