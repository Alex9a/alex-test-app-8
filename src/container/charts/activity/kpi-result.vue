<template>
  <div class="kpi-result">
    <!-- <h3>库存超100件的SKU数</h3> -->

    <!-- <div class="data-column border">
      <div
        class="data-item"
        v-for="(item, key, index) in activityInfo"
        :key="index"
      >
        <p class="title">{{ item.label }}</p>
        <p class="value">
          {{ item.value }}
          <span class="unit">{{ item.unit }}</span>
          <span class="icon" :class="[item.type + 'c']" v-if="item.icon"
            >(<i class="iconfont" :class="[item.type]"></i>{{ item.icon }})
          </span>
        </p>
      </div>
    </div> -->
    <div class="data-column">
      <div class="data-item" v-for="(item, key, index) in datas" :key="index">
        <p class="title">{{ item.label }}</p>
        <p class="value">
          {{ item.value }}<span class="unit">{{ item.unit }}</span>
        </p>
      </div>
    </div>

    <div class="line-chart" ref="lineChart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

import debounce from 'lodash/debounce'

import {price} from '@/const/filter'

export default {
  props: {
    targetData: {
      type: Object,
      default: _ => {}
    }
  },
  computed: {
    activityInfo() {
      let {
        afterCount,
        afterCountPercent,
        isCartCount,
        isCartPercent,
        initCount
      } = this.targetData

      return {
        before: {
          label: '活动前',
          value: price(initCount, true),
          unit: '个'
        },
        carts: {
          label: '活动中有加购物车',
          value: price(isCartCount, true),
          unit: `个（占比：${(isCartPercent * 100).toFixed(2)}%）`
        },
        lost: {
          label: '活动后库存超100还剩下',
          value: price(afterCount, true),
          unit: '个',
          icon: `${(afterCountPercent * 100).toFixed(2)}%`,
          type: 'yldown' // ylup / yldown
        }
      }
    },
    datas() {
      let {
        activityPrice,
        subStockPercent,
        targetGoods,
        tradingGoods
      } = this.targetData

      return {
        totalAmount: {
          label: '活动交易总金额',
          value: price(activityPrice, true) || 0,
          unit: '元'
        },
        saleRatio: {
          label: '活动交易总商品数',
          value: price(tradingGoods, true) || 0,
          unit: '个'
        },
        stockAmount: {
          label: '活动目标商品总数',
          value: price(targetGoods, true) || 0,
          unit: ''
        },
        stockRatio: {
          label: '降低库存比率',
          value: (subStockPercent * 100 || 0).toFixed(2),
          unit: '%'
        }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()

    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) return
    window.removeEventListener('resize', this.resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 用户缩放浏览器debounce
    resizeHandler: debounce(function() {
      this.chart.resize()
    }, 100),
    initChart() {
      this.chart = echarts.init(this.$refs.lineChart, 'macarons')
      this.setOptions()
    },
    setOptions() {
      let options = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2019-5-1', '2019-5-2', '2019-5-3', '2019-5-4', '2019-5-5'],
          axisLabel: {
            interval: 'auto', // x轴不重复,
            color: '#000'
          },
          axisLine: {
            lineStyle: {
              color: '#000'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '交易金额',
            nameLocation: 'end',
            nameGap: 20,
            max: 50000,
            axisLabel: {
              color: '#000'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#000'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            splitArea: {
              show: false
            }
          },
          {
            type: 'value',
            name: '交易数量',
            nameLocation: 'end',
            nameGap: 20,
            max: 5000,
            axisLabel: {
              color: '#000'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#000'
              }
            },
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '交易金额',
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#1890FF'
            },
            itemStyle: {
              normal: {
                color: '#1890FF'
              }
            },
            data: [10000, 15000, 10000, 20000, 50000]
          },
          {
            name: '交易数量',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            lineStyle: {
              color: '#2FC25B'
            },
            itemStyle: {
              normal: {
                color: '#2FC25B'
              }
            },
            data: [500, 3000, 200, 4000, 5000]
          }
        ]
      }

      this.chart.setOption(options)
    }
  }
}
</script>

<style lang="less">
.kpi-result {
  .data-column {
    display: flex;
    padding: 20px 0;
    // justify-content: space-between;

    &.border {
      border-bottom: 1px solid #ddd;
    }

    .data-item {
      width: 25%;
    }

    .title {
      color: #bbb;
      margin-bottom: 4px;
    }

    .value {
      font-size: 24px;
      color: #272727;

      .unit {
        font-size: 14px;
        color: #aaa;
      }

      .icon {
        font-size: 14px;

        i {
          font-size: 12px;
        }

        &.ylupc {
          color: red;
        }

        &.yldownc {
          color: #6c3;
        }
      }
    }
  }

  .line-chart {
    width: 100%;
    height: 280px;
    margin: 0 auto;
  }
}
</style>
