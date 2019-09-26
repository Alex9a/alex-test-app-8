<template>
  <div class="activity-create" v-loading="loading">
    <go-back />

    <!-- <sub-title
      v-if="pageType == PAGE_TYPE.add"
      :title="activeTitle"
    ></sub-title> -->

    <!-- 步骤条 -->
    <el-steps
      v-if="pageType == PAGE_TYPE.add"
      :active="activeStep + 1"
      process-status="wait"
      align-center
      class="steps"
    >
      <el-step
        :title="item.label"
        v-for="(item, index) in stepList"
        :key="index"
      ></el-step>
    </el-steps>

    <!-- 基础设置 -->
    <basic-setting
      v-if="pageType == PAGE_TYPE.add"
      v-show="activeStep == 0"
      @handleStepChange="handleStepChange"
    ></basic-setting>

    <!-- 策略设置 -->
    <policy-setting
      v-if="pageType == PAGE_TYPE.add"
      v-show="activeStep == 1"
      @handleUpdateData="handleUpdateData"
      @handleStepChange="handleStepChange"
      @prevStep="prevStep"
      :minStock="form.minStock"
    ></policy-setting>

    <!-- 确认设置 -->
    <activity-confirm
      v-if="activeStep == 2 || pageType == PAGE_TYPE.view"
      :data="form"
      :page-type="pageType"
      @prevStep="prevStep"
      @submit="submit"
    ></activity-confirm>
  </div>
</template>

<script>
import {Steps, Step} from 'element-ui'

import {
  PAGE_TYPE,
  STATUS_KEY,
  collectionKey,
  POLICY_TYPE
} from '@/const/activity.js'

import BasicSetting from '@/container/activity/activity-setting/basic-setting'

import PolicySetting from '@/container/activity/policy-setting/policy-setting'

import ActivityConfirm from '@/container/activity/activity-confirm/activity-confirm'

import {otherCenter} from '@/const/api.js'

export default {
  validate({params}) {
    // 满足pagetype选项的路由才可显示
    return !!PAGE_TYPE[params.type]
  },
  components: {
    'el-steps': Steps,
    'el-step': Step,
    BasicSetting,
    PolicySetting,
    ActivityConfirm
  },
  data() {
    return {
      form: {},
      PAGE_TYPE,
      pageType: null,
      activeStep: 0,
      stepList: [
        {label: '活动设置'},
        {label: '策略设置'},
        {label: '确认活动内容'}
      ],
      loading: false
    }
  },
  mounted() {
    this.pageType = this.$route.params.type
    if (this.pageType != PAGE_TYPE.add) this.getActivityInfo()
  },
  computed: {
    activeTitle() {
      return this.stepList[this.activeStep].label || '活动设置'
    }
  },
  methods: {
    getActivityInfo() {
      this.loading = true

      this.$axios
        .$post(
          `${otherCenter.findOneByCondition}?collection=${
            collectionKey.activity
          }`,
          {
            activityId: +this.$route.query.id
          }
        )
        .then(res => {
          this.loading = false
          if (res.code == 0) {
            this.form = res.payload || {}
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error(res.msg || '服务器繁忙，请稍后再试')
        })
    },
    syncActivityData(data) {
      this.$axios
        .$post(otherCenter.syncActivity, data)
        .then(res => {})
        .catch(res => {})
    },
    submit() {
      this.loading = true

      // 将策略中的商品范围 的商品id组成数组
      let ids = this.form.strategies.reduce((prev, item) => {
        return prev.concat(item.goods.map(g => g.id))
      }, [])

      // 可能存在相同商品 去重
      let goodsNumber = Array.from(new Set(ids)).length

      // 活动商品总库存
      const TOTAL_STOCK = this.form.strategies.reduce((prev, item) => {
        return (prev += item.goods.reduce((p, i) => (p += i.stock), 0))
      }, 0)

      // 活动id
      const ACTIVITY_ID = +new Date()

      // 给每条策略加上活动id
      this.form.strategies.forEach(i => (i.activityId = ACTIVITY_ID))

      // 同步活动数据 统计使用
      this.syncActivityData({
        activityId: ACTIVITY_ID,
        goodId: ids,
        singleDiscount: this.form.strategies
          .filter(item => {
            return item.type == POLICY_TYPE.direct_discount
          })
          .reduce((prev, item) => {
            let data = item.goods.map(it => it.id)

            return prev.concat(
              data.map(g => ({
                id: g,
                discount: item.rules && item.rules[0] && item.rules[0].discount
              }))
            )
          }, [])
      })

      this.$axios
        .$post(`${otherCenter.addOne}?collection=${collectionKey.activity}`, {
          status: STATUS_KEY.doing, // 状态为进行中
          createdTime: +new Date(),
          activityId: ACTIVITY_ID,
          totalStock: TOTAL_STOCK,
          goodsNumber: goodsNumber,
          ...this.form
        })
        .then(res => {
          this.loading = false

          if (res.code == 0) {
            this.$message.success('创建成功')
            this.$router.back()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(e => {
          this.loading = false
        })
    },
    handleUpdateData(res) {
      this.form = Object.assign(this.form, res)
    },
    handleStepChange(res) {
      this.handleUpdateData(res)
      ++this.activeStep
    },
    prevStep() {
      --this.activeStep
    }
  }
}
</script>

<style lang="less" scoped>
.activity-create {
  .steps {
    margin: 40px 0;
  }

  /deep/ .el-step__icon {
    width: 34px;
    height: 34px;
  }

  /deep/ .el-step__line {
    top: 17px;
  }
}
</style>
