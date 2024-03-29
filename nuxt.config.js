require('dotenv').config()

const env = process.env
const isProd = env.MODE == 'prod'
const mockServer =
  'https://easy-mock.com/mock/5c1b3895fe5907404e654045/femessage-mock'
const metaJson = require('./meta.json')
const materialJson = require('../../material.json')
const outputDir = `dist${metaJson.hash}`
const ossPath = `http://serverless-platform.deepexi.top/materials/${
  materialJson.materialId
}/${outputDir}`
// 不能以斜杠结尾
let apiServer = process.env.API_SERVER || 'http://39.105.0.116/poctest/poc'
// 必须以斜杠结尾
let publicPath = process.env.PUBLIC_PATH
// 打包资源路径应修改为oss上的东西
publicPath = process.env.NODE_ENV === 'production' ? ossPath : ''
// 打包文件夹名  dist+物料hash

const config = {
  aliIconFont: '',
  env: {
    mock: {
      '/deepexi-tenant': mockServer,
      '/deepexi-permission': mockServer
    },
    dev: {
      '/deepexi-tenant': apiServer,
      '/deepexi-permission': apiServer,
      'http://39.105.0.116/poctest': apiServer
    }
  }
}

let axios = {
  proxy: true
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer
  }
}

module.exports = {
  mode: 'spa',
  env: {
    NO_LOGIN: process.env.NO_LOGIN,
    COOKIE_PATH: process.env.COOKIE_PATH || '/'
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta'],
    mode: 'hash'
  },
  /*
   ** Build configuration
   */
  generate: {
    dir: outputDir
  },
  build: {
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'Optimus',
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        'http-equiv': 'x-ua-compatible',
        content: 'IE=edge, chrome=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '开发平台'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//at.alicdn.com/t/font_1210772_8nqvqets5wg.css'
      },
      {
        // rel: 'stylesheet',
        // type: 'text/css',
        // href: config.aliIconFont
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#1890ff'
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less'
    }
  ],
  srcDir: 'src/',
  plugins: [
    {
      src: '~/plugins/axios'
    },
    {
      src: '~/plugins/element'
    },
    {
      src: '~/plugins/components'
    }
  ],
  modules: [
    ['@nuxtjs/axios'],
    [
      '@nuxtjs/dotenv',
      {
        path: './'
      }
    ]
  ],
  axios
}
