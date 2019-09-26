<template>
  <div class="activity-list">
    <sub-title title="活动管理"></sub-title>

    <el-data-table v-bind="tableConfig"></el-data-table>
  </div>
</template>

<script>
import {Tag} from 'element-ui'

import {otherCenter} from '@/const/api.js'

import {formatDate} from '@/const/filter.js'

import ElDataTable from '@/components/el-data-table'

import {
  PAGE_TYPE,
  STATUS_TAG_TYPE,
  STATUS_MAP,
  STATUS_LIST,
  ACTIVITY_TYPE,
  collectionKey
} from '@/const/activity.js'

import {CREATE_ACTIVITY, CHARTS} from '@/const/path.js'

export default {
  components: {
    'el-tag': Tag,
    ElDataTable
  },
  data() {
    return {
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload',
        totalPath: 'payload.totalPath',
        hasDialog: false,
        hasPagination: true,
        hasOperation: true,
        isTree: false,
        url: otherCenter.findAll,
        customQuery: {
          collection: collectionKey.activity,
          clean: true
        },
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: false,
        single: false,
        operationAttrs: {
          width: '200px'
        },
        transform: this.transform,
        headerButtons: [
          {
            text: '新建活动',
            type: 'primary',
            atClick: () => {
              this.$router.push(CREATE_ACTIVITY(PAGE_TYPE.add))
              return Promise.resolve(false)
            }
          }
        ],
        extraButtons: [
          {
            text: '查看活动',
            type: 'text',
            atClick: ({activityId}) => {
              this.$router.push({
                path: CREATE_ACTIVITY(PAGE_TYPE.view),
                query: {id: activityId}
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '活动分析',
            type: 'text',
            atClick: row => {
              this.$router.push({
                path: CHARTS,
                query: {
                  id: row.activityId,
                  startTime: row.startTime,
                  endTime: row.endTime
                }
              })
              return Promise.resolve(false)
            }
          },
          {
            text: '暂停',
            type: 'text',
            show: row => row.status === 0,
            atClick: row => {
              return this.$axios.$post(
                otherCenter.updateByCondition + '?collection=activity',
                {
                  args: {
                    activityId: row.activityId
                  },
                  update: {
                    status: 1
                  }
                }
              )
            }
          },
          {
            text: '开始',
            type: 'text',
            show: row => row.status === 1,
            atClick: row => {
              return this.$axios.$post(
                otherCenter.updateByCondition + '?collection=activity',
                {
                  args: {
                    activityId: row.activityId
                  },
                  update: {
                    status: 0
                  }
                }
              )
            }
          }
        ],
        columns: [
          {
            type: 'index',
            label: '序号'
          },
          {
            prop: 'name',
            label: '活动名称'
          },
          {
            prop: 'type',
            label: '类型',
            formatter: ({type}) => {
              return ACTIVITY_TYPE[type]
            }
          },
          {
            prop: 'status',
            label: '促销状态',
            formatter: ({status}) => {
              return (
                <el-tag type={STATUS_TAG_TYPE[status]}>
                  {STATUS_MAP[status]}
                </el-tag>
              )
            }
          },
          {
            prop: 'startTime',
            label: '促销时间',
            width: '295px',
            formatter(row) {
              return `${formatDate(
                row.startTime,
                'YYYY-MM-DD HH:mm'
              )} 至 ${formatDate(row.endTime, 'YYYY-MM-DD HH:mm')}`
            }
          },
          {
            prop: 'createdTime',
            label: '创建时间',
            width: '150px',
            formatter({createdTime}) {
              return formatDate(createdTime, 'YYYY-MM-DD HH:mm')
            }
          },
          {
            prop: 'goodsNumber',
            label: '活动商品'
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '活动名称',
            $el: {
              placeholder: '请输入活动名称'
            }
          },
          {
            $type: 'select',
            $id: 'status',
            label: '活动状态',
            $el: {
              placeholder: '请选择活动状态'
            },
            $options: STATUS_LIST
          }
        ]
      }
    }
  },
  methods: {
    transform(data) {
      return data.sort((a, b) => b.createdTime - a.createdTime)
    }
  }
}
</script>

<style lang="less" scoped></style>
