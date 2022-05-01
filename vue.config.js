module.exports = {
  devServer: {
    overlay: {
        warnings: false,
        errors: false
    },
    lintOnSave: false
  },
  chainWebpack: config => {
    // 生产环境
    // config.when(process.env.NODE_ENV === 'production', config => {
    //   config.entry('app').clear().add('./src/main-prod.js')
    //   // 通过 externals 加载外部 CDN 资源
    //   config.set('externals', {
    //     vue: 'Vue',
    //     'vue-router': 'VueRouter',
    //     axios: 'axios',
    //     lodash: '_',
    //     echarts: 'echarts',
    //     nprogress: 'NProgress',
    //     'vue-quill-editor': 'VueQuillEditor'
    //   })
    //   // 通过.tap 链式操作修改插件里面相关参数
    //   config.plugin('html').tap(args => {
    //     args[0].isProd = true
    //     return args
    //   })
    // })
    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 通过.tap 链式操作修改插件里面相关参数
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  css: {
    extract: false
  },
  devServer: {
    open: true,
    // host:'http://101.201.220.43',
    host: 'localhost',
    // host:'http://396p89578i.zicp.vip',
    port: 8080,
    https: false,
    //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {//配置跨域
        '/api': {
            // target:'https://www.liulongbin.top:8888/api/private/v1/',
            // target: 'http://101.201.220.43/api',
            target: 'http://101.201.220.43:3001/api',
            // target: 'http://localhost:3001/api',//这里后台的地址模拟的;应该填写你们真实的后台接口
            ws: true,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/api': ''//请求的时候使用这个api就可以
            }
        }

    },
    disableHostCheck: true,
  }
}
