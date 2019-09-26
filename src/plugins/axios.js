import Vue from 'vue'
import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'

const cleanModeKey = [
  {key: 'name'},
  {key: 'status', format: v => +v},
  {key: 'stock', format: v => +v}
]

const path = process.env.COOKIE_PATH

export default function(context) {
  let {$axios, store, app, redirect} = context

  $axios.onRequest(config => {
    let url = config.url
    // jwt 验证
    // if (store.state.token) {
    //   config.headers.common['Authorization'] = `Bearer ${store.state.token}`
    // }

    url += url.indexOf('?') > -1 ? '&' : '?'
    url += `tenantId=${store.state.tenantId}&userId=${
      store.state.userId
    }&_=${new Date().getTime()}`

    let data = {}
    url
      .split('?')[1]
      .split('&')
      .forEach(i => {
        var item = i.split('=')
        data[item[0]] = decodeURI(item[1])
      })

    // 接口只允许传递查询字段
    if (data.clean) {
      let obj = {}
      url = url.split('?')[0] + '?collection=' + data['collection']

      cleanModeKey.forEach((i, index) => {
        data[i.key] &&
          (obj[i.key] = i.format ? i.format(data[i.key]) : data[i.key])
      })

      url += `&json=${JSON.stringify(obj)}`
      url = encodeURI(url)
    }

    config.url = url

    return config
  })

  $axios.onError(error => {
    if (process.client) {
      // axios 数据结构
      let resp = error.response
      let data = resp.data

      Vue.$notify.error({
        title: resp.status,
        message: data.payload || data.msg
      })

      if (resp.status == 401) {
        cookieKeys.forEach(key => {
          cookie.remove(key, {path})
        })
        redirect('/login')
      }
    }
    // TODO asyncData 的错误 需要日志监控
    else console.log('error', error)
  })
}
