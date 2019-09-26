import {version} from '../common'

export const categoriesTree =
  'http://39.100.141.76:3000:3000/mock/116/categories/tree'

// 创建活动
export const createActivity = 'http://39.100.141.76:3000:3000/mock/116/activity'

const baseUrl = '/poc'

// 新增collection中单个数据的通用接口
export const addOne = `${baseUrl}/api/v1/common/addOne`

// 查询collection中所有的数据通用接口
export const findAll = `${baseUrl}/api/v1/common/findAllByCondition`

// 活动参与明细列表
export const activityJoinList = id =>
  `http://39.100.141.76:3000/mock/116/activity/join/${id}`

// 查询collection中符合条件的所有数据的通用接口
export const findOneByCondition = `${baseUrl}/api/v1/common/findOneByCondition`

export const updateByCondition = `${baseUrl}/api/v1/common/updateByCondition`

// 获取活动报表数据接口
export const getFunnerData = `${baseUrl}/api/v1/report/getActivityAnalyseData`

// 新建活动时候同步调用的接口
export const syncActivity = `${baseUrl}/api/v1/report/addActivity`

// 获取商品销售情况接口
export const getGoodsAnalyseData = `${baseUrl}/api/v1/report/getGoodAnalyseData`

export const getFunner = 'http://39.105.18.216:8083/api/v1/dashboard/'
