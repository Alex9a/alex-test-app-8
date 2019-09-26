const map2List = function(obj) {
  return Object.keys(obj).map(k => ({
    label: obj[k],
    value: k
  }))
}

export const collectionKey = {
  activity: 'activity', //活动相关
  product: 'product' //商品相关
}

// 页面类型
export const PAGE_TYPE = {
  add: 'add',
  edit: 'edit',
  view: 'view'
}

export const STATUS_KEY = {
  doing: 0,
  stop: 1,
  finish: 2
}

export const STATUS_TAG_TYPE = {
  [STATUS_KEY.doing]: 'success',
  [STATUS_KEY.stop]: 'danger',
  [STATUS_KEY.finish]: 'danger'
}

// 活动状态
export const STATUS_MAP = {
  [STATUS_KEY.doing]: '进行中',
  [STATUS_KEY.stop]: '已暂停',
  [STATUS_KEY.finish]: '已结束'
}

// 活动状态列表
export const STATUS_LIST = map2List(STATUS_MAP)

// 活动类型
export const ACTIVITY_TYPE = {
  0: '日常促销',
  1: '节假日促销',
  2: '其他促销'
}

// 活动类型列表
export const ACTIVITY_TYPE_LIST = map2List(ACTIVITY_TYPE)

// 活动目的
export const PURPOSE_MAP = {
  0: '提升业绩',
  1: '降低库存'
}

// 活动对象（用户）
export const USER_LIMIT = {
  1: '所有人',
  2: '指定'
}

// 活动目的
export const ACTIVITY_PURPOSE = {
  0: '提升业绩',
  1: '降低库存'
}

// 策略类型
export const POLICY_TYPE = {
  sendLow: '0',
  deduction: '1',
  sendOne: '2',
  discount: '3',
  direct_discount: '4'
}

// 策略类型
export const POLICY_TYPE_MAP = {
  0: '买高送低',
  1: '满额减价',
  2: '单品买送',
  3: '满额打折',
  4: '单品打折'
}

// 策略列表
export const POLICY_LIST = [
  {
    name: POLICY_TYPE_MAP[0],
    desc: '任意挑选x件</br>最低价商品免费',
    type: 0
  },
  {
    name: POLICY_TYPE_MAP[1],
    desc: '满x元减x元',
    type: 1
  },
  {
    name: POLICY_TYPE_MAP[2],
    desc: '单品买x件送x件',
    type: 2
  },
  {
    name: POLICY_TYPE_MAP[3],
    desc: '满x元享受指定折扣',
    type: 3
  },
  {
    name: POLICY_TYPE_MAP[4],
    desc: '单品享受x折',
    type: 4
  }
]
