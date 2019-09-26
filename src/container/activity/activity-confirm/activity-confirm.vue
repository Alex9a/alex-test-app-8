<template>
  <div class="activity-confirm">
    <sub-title title="活动设置："></sub-title>

    <basic-setting readonly :data="data"></basic-setting>

    <sub-title title="促销策略："></sub-title>

    <policy-list
      class="mb10"
      readonly
      :list="data.strategies"
      is-expand-all
      readonly
    ></policy-list>

    <div class="btn-control" v-if="pageType != PAGE_TYPE.view">
      <el-button type="primary" @click="onSubmit">创建完成</el-button>
      <!-- <el-button @click="prevStep">上一步</el-button> -->
    </div>
  </div>
</template>

<script>
import {PAGE_TYPE} from '@/const/activity.js'

import BasicSetting from '@/container/activity/activity-setting/basic-setting'

import PolicyList from '@/container/activity/policy-setting/policy-list'

export default {
  name: 'ActivityConfirm',
  components: {
    BasicSetting,
    PolicyList
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    pageType: {
      type: String,
      default: PAGE_TYPE.add
    }
  },
  data() {
    return {
      PAGE_TYPE
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit')
    },
    prevStep() {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';
</style>
