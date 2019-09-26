<template>
  <div class="activity" v-loading="loading">
    <div class="funner">
      <sub-title>
        <!-- <el-button @click='getFunner'>漏斗数据</el-button> -->
        <span>活动漏斗</span>
        <!-- <span>
          日期：
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </span>-->
      </sub-title>

      <trapezoid-summary :data="data"></trapezoid-summary>
    </div>

    <div class="kpi-result">
      <sub-title title="活动目标完成情况"></sub-title>

      <kpi-result :targetData="targetData"></kpi-result>
    </div>

    <div class="activityInfo">
      <sub-title title="活动参与明细"></sub-title>

      <join-info :list="userList" ref="joinInfo"></join-info>
    </div>
  </div>
</template>

<script>
import trapezoidSummary from '@/container/charts/trapezoid-summary'

import KpiResult from '@/container/charts/activity/kpi-result'

import JoinInfo from '@/container/charts/activity/join-info'

import {otherCenter} from '@/const/api.js'

import {formatDate} from '@/const/filter.js'

import _get from 'lodash.get'

import dayjs from 'dayjs'

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
  components: {
    trapezoidSummary,
    KpiResult,
    JoinInfo
  },
  watch: {
    timer(val) {
      this.getFunner()
    }
  },
  computed: {
    ID() {
      return +this.$route.query.id
    },
    searchTime() {
      let {startTime, endTime} = this.$route.query

      return {
        minTime: formatDate(new Date(+startTime), TIME_FORMAT),
        maxTime: formatDate(new Date(+endTime), TIME_FORMAT)
      }
    },
    timeByDays() {
      let {startTime, endTime} = this.$route.query,
        begin = dayjs(+startTime),
        end = dayjs(+endTime),
        now = dayjs(new Date())

      return now.isBefore(end) ? begin.diff(now, 'day') : begin.diff(end, 'day')
    }
  },
  data() {
    return {
      timer: null,
      data: {
        login: {
          totalCount: 0
          // averageCount: 0,
          // yesterday: 0,
          // conversionRate: 0
        },
        product: {
          totalCount: 0
          // averageCount: 0,
          // yesterday: 0,
          // conversionRate: 0
        },
        shopCart: {
          totalCount: 0
          // averageCount: 0,
          // yesterday: 0,
          // conversionRate: 0
        },
        order: {
          totalCount: 0
          // averageCount: 0,
          // yesterday: 0,
          // conversionRate: 0
        },
        pay: {
          totalCount: 0
          // averageCount: 0,
          // yesterday: 0,
          // conversionRate: 0
        }
      },
      funnerData: {}, // 漏斗数据
      targetData: {}, // 活动目标完成情况
      loading: false,
      userList: []
    }
  },
  mounted() {
    // this.getLoginData()
    // this.getFunnerData()
  },
  methods: {
    resetData() {},
    getLoginData() {
      this.$axios
        .$get(`${otherCenter.getFunner}`, {
          params: {
            minTime: this.searchTime.minTime || '',
            maxTime: this.searchTime.maxTime || '',
            activityId: ''
          }
        })
        .then(res => {
          if (res.status == 200) {
            let data =
                _get(
                  res,
                  `data.total.login.results[0].series[0].values[0][1]`
                ) || 0,
              yesterday =
                _get(
                  res,
                  `data.lastDay.login.results[0].series[0].values[0][1]`
                ) || 0

            this.data.login.totalCount = data
            // this.data.login.averageCount =
            //   this.timeByDays > 0 ? parseInt(data / this.timeByDays) : data
            // this.data.login.yesterday = yesterday

            this.getFunner()
          }
        })
        .catch(res => {
          this.$message.error('服务器繁忙,请稍后再试')
        })
    },
    getFunner() {
      this.$axios
        .$get(`${otherCenter.getFunner}`, {
          params: {
            minTime: this.searchTime.minTime || '',
            maxTime: this.searchTime.maxTime || '',
            activityId: this.ID
          }
        })
        .then(res => {
          if (res.status == 200) {
            for (let i in this.data) {
              // 支付信息与下单信息一致
              if (i == 'login') {
                continue
              }
              let key = i == 'pay' ? 'order' : i,
                data =
                  _get(
                    res,
                    `data.total.${key}.results[0].series[0].values[0][1]`
                  ) || 0,
                yesterday =
                  _get(
                    res,
                    `data.lastDay.${key}.results[0].series[0].values[0][1]`
                  ) || 0

              this.data[i].totalCount = data
              // this.data[i].averageCount =
              //   this.timeByDays > 0 ? parseInt(data / this.timeByDays) : data
              // this.data[i].yesterday = yesterday
            }

            // 登录人数转化率
            this.data.login.conversionRate =
              parseInt(
                (this.data.pay.totalCount / this.data.login.totalCount) * 100
              ) || 0
            // 访问商品详情转化率
            this.data.product.conversionRate =
              parseInt(
                (this.data.product.totalCount / this.data.login.totalCount) *
                  100
              ) || 0
            // 加入购物车转化率
            this.data.shopCart.conversionRate =
              parseInt(
                (this.data.shopCart.totalCount / this.data.product.totalCount) *
                  100
              ) || 0
            // 活动商品下单转化率
            this.data.order.conversionRate =
              parseInt(
                (this.data.order.totalCount / this.data.shopCart.totalCount) *
                  100
              ) || 0
            // 活动支付人数转化率
            this.data.pay.conversionRate =
              this.data.order.conversionRate > 0 ? 100 : 0
          } else {
            this.$message.error(res.msg || '服务器繁忙，请稍后再试')
          }
        })
        .catch(res => {
          this.$message.error('服务器繁忙,请稍后再试')
        })
    },
    getFunnerData() {
      this.loading = true
      // 获取漏斗数据
      this.$axios
        .$post(`${otherCenter.getFunnerData}?activityId=${this.ID}`)
        .then(res => {
          this.loading = false
          if (res.code == 0) {
            this.userList = res.payload.userParticipateDetail || []
            const payload = res.payload || {}
            this.targetData = {
              ...payload,
              subStockPercent:
                payload.subStockPercent === 0
                  ? 0
                  : payload.subStockPercent < 0.0001
                  ? 0.0001
                  : payload.subStockPercent
            }

            this.$refs.joinInfo.setData(this.userList)
          } else {
            this.$message.error(res.msg || '服务器繁忙，请稍后再试')
          }
        })
        .catch(res => {
          this.loading = false
          this.$message.error('服务器繁忙,请稍后再试')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.activity {
  min-width: 1000px;

  .box-style {
    background: #fff;
    padding: 5px 20px 20px;
    box-sizing: border-box;
    margin-top: 14px;
  }

  .funner,
  .kpi-result,
  .activityInfo {
    .box-style();
  }
}
</style>
