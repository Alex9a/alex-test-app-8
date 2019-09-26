import cookie from 'js-cookie'
import cookieKeys from '@/const/cookie-keys'

import {configCenter, enterpriseContact} from '@/const/api'

const cookiePath = process.env.COOKIE_PATH
// 最好提前在你的 store 中初始化好所有所需属性
// https://vuex.vuejs.org/zh-cn/mutations.html
export const state = () => ({
  // 这两个用于client side的使用, 又放cookie里是为了刷新时状态不丢失
  userId: '',
  token: '',
  tenantId: 'afiona',
  meta: {},

  user: {
    userId: '16e577069ac44399b73d45e2acbf3b66',
    id: '16e577069ac44399b73d45e2acbf3b66',
    tenantId: '620e80bfd862423d9299620038f94a45',
    createdBy: null,
    createdAt: 946656000000,
    updatedBy: 'admin',
    updatedAt: 1548300528000,
    dr: 0,
    accountId: '798b9812d3f4408e83b9399d09d1758c',
    password: null,
    token: null,
    username: 'admin',
    usernumber: null,
    nickname: '管理员',
    email: 'admin@deepexi.com',
    avatar:
      '//deepexi-moby.oss-cn-shenzhen.aliyuncs.com/me的副本-1545201407351.jpg',
    gender: null,
    phone: '13555555555',
    status: '1',
    type: '1',
    ext1: null,
    ext2: null,
    ext3: null,
    ext4: null,
    ext5: null,
    extJson: null,
    roles: []
  },
  menuList: [
    {
      id: 91942,
      parentId: null,
      name: '活动',
      nameEn: 'activity',
      url: '/activity/list',
      remark: null,
      icon:
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
      sort: 152,
      tag: 'system'
    },
    {
      id: 91942,
      parentId: null,
      name: '数据',
      nameEn: 'charts',
      url: '/charts',
      remark: null,
      icon:
        'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
      sort: 152,
      tag: 'system'
    }
  ],
  permission: {}
})

//  mutation 必须同步执行
export const mutations = {
  login(state, payload) {
    // 部署不一定是在根路径, 所以cookie要设置path
    cookieKeys.forEach(key => {
      state[key] = payload[key]
      cookie.set(key, payload[key], {
        path: cookiePath
      })
    })
  },
  logout(state) {
    cookieKeys.forEach(key => {
      // 移除tenantId将无法登陆
      key !== 'tenantId' && (state[key] = '')
      cookie.remove(key, {
        path: cookiePath
      })
    })
  },
  update(state, payload) {
    Object.keys(payload).forEach(k => {
      state[k] = payload[k]
    })
  }
}

// Action 提交的是 mutation，而不是直接变更状态
// Action 可以包含任意异步操作
export const actions = {
  async login(context, payload) {
    // store 对象
    // console.log(context)
    let {commit, state, dispatch} = context

    let resp = await this.$axios.$post(enterpriseContact.login, {
      ...payload,
      channel: 'showyu',
      code: state.tenantId
    })
    commit('login', resp.payload)

    dispatch('fetchUserAndMenuList', {userId: resp.payload.userId})
  },
  async fetchUserAndMenuList({commit}, {userId}) {
    // let user = await this.$axios.$get(configCenter.userDetail(userId))

    const user = {
      payload: {
        userId: '16e577069ac44399b73d45e2acbf3b66',
        id: '16e577069ac44399b73d45e2acbf3b66',
        tenantId: '620e80bfd862423d9299620038f94a45',
        createdBy: null,
        createdAt: 946656000000,
        updatedBy: 'mifei',
        updatedAt: 1548300528000,
        dr: 0,
        accountId: '798b9812d3f4408e83b9399d09d1758c',
        password: null,
        token: null,
        username: 'miffy',
        usernumber: null,
        nickname: '米肥',
        email: 'mi_ffy@yeah.net',
        avatar:
          '//deepexi-moby.oss-cn-shenzhen.aliyuncs.com/me的副本-1545201407351.jpg',
        gender: null,
        phone: '15521198999',
        status: '1',
        type: '1',
        ext1: null,
        ext2: null,
        ext3: null,
        ext4: null,
        ext5: null,
        extJson: null,
        roles: []
      },
      code: '0',
      msg: 'ok'
    }

    commit('update', {user: user.payload})

    // let menuResources = await this.$axios.$get(
    //   configCenter.menuResource(userId)
    // )

    const menuResources = {
      payload: {
        permission: {},
        menu: [
          {
            id: 91939,
            parentId: null,
            name: '会员管理',
            nameEn: 'member-list',
            url: '/member/list',
            remark: null,
            icon:
              'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
            sort: 149,
            tag: 'system'
          },
          {
            id: 91940,
            parentId: null,
            name: '订单管理',
            nameEn: 'order-list',
            url: '/order/list',
            remark: null,
            icon:
              'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
            sort: 150,
            tag: 'system'
          },
          {
            id: 91942,
            parentId: null,
            name: '周年庆',
            nameEn: 'anniversary',
            url: '/anniversary/activity',
            remark: null,
            icon:
              'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/%E5%B7%A6%E4%BE%A7%E8%8F%9C%E5%8D%95/computer.svg',
            sort: 152,
            tag: 'system'
          },
          {
            id: 91943,
            parentId: null,
            name: '资讯管理',
            nameEn: 'article',
            url: '',
            remark: null,
            icon: '',
            sort: 153,
            tag: 'system',
            children: [
              {
                id: 919431,
                parentId: 91943,
                name: '文章列表',
                nameEn: 'articleList',
                url: '/article/list',
                remark: null,
                icon: '',
                sort: 0,
                tag: 'system',
                children: null,
                operators: ['GET'],
                projectNo: null
              },
              {
                id: 919432,
                parentId: 91943,
                name: '分类管理',
                nameEn: 'articleCategory',
                url: '/article/category',
                remark: null,
                icon: '',
                sort: 0,
                tag: 'system',
                children: null,
                operators: ['GET'],
                projectNo: null
              },
              {
                id: 919433,
                parentId: 91944,
                name: '奖励规则',
                nameEn: 'articleRewardList',
                url: '/article/reward/list',
                remark: null,
                icon: '',
                sort: 0,
                tag: 'system',
                children: null,
                operators: ['GET'],
                projectNo: null
              }
            ],
            operators: ['GET']
          },
          {
            id: 91946,
            parentId: null,
            name: '数据中心',
            nameEn: 'data-center',
            url: '/dataCenter/chart',
            remark: null,
            icon:
              'https://bucket-showyu.oss-cn-beijing.aliyuncs.com/console/icon/data.svg',
            sort: 150,
            tag: 'system'
          }
        ]
      },
      request_id: '706f8cb5-98c0-4d62-8f63-ad8a14a97ecc'
    }

    // if (!menuResources.payload)
    //   menuResources.payload = {
    //     menu: [],
    //     permission: {}
    //   }

    commit('update', {
      menuList: menuResources.payload.menu,
      permission: menuResources.payload.permission
    })
  },
  // 配置的元信息
  async fetchMetaInfo({commit}) {
    let resp = await this.$axios.$get(configCenter.config)
    let meta = {}
    resp.payload.forEach(item => {
      meta[item.key] = item.value
    })
    commit('update', {meta})
  }
}
