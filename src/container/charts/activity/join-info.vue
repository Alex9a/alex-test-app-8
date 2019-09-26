<template>
  <div class="join-info">
    <el-data-table v-bind="tableConfig" ref="table"></el-data-table>
  </div>
</template>

<script>
import {otherCenter} from '@/const/api.js'

import {formatDate} from '@/const/filter.js'

import {collectionKey} from '@/const/activity.js'

const USER_LEVEL = {
  1: '银卡会员',
  3: '金卡会员',
  4: '白金卡会员'
}

export default {
  props: {
    userList: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalPath',
        hasDialog: false,
        hasPagination: false,
        hasOperation: false,
        isTree: false,
        url: '', //otherCenter.activityJoinList(1),
        customQuery: {
          collection: collectionKey.activity
        },
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: false,
        single: false,
        columns: [
          {
            prop: 'name',
            label: '会员昵称'
          },
          {
            prop: 'level',
            label: '会员等级',
            formatter({level}) {
              return USER_LEVEL[level]
            }
          },
          {
            prop: 'amount',
            label: '活动交易金额',
            formatter({amount}) {
              return `￥${amount.toFixed(2)}`
            }
          },
          {
            prop: 'date',
            label: '参与活动时间',
            formatter({date}) {
              return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
            }
          }
        ]
      }
    }
  },
  methods: {
    setData(data) {
      this.$nextTick(function() {
        this.$refs.table.data = data
      })
    }
  }
}
</script>
