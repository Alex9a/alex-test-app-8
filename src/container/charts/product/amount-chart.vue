<template>
  <div class="amount-chart">
    <sub-title class="subtitle">
      <span>商品金额占比</span>
      <div>
        <el-radio-group v-model="displayData" @change="change">
          <el-radio-button label="1">品类</el-radio-button>
          <el-radio-button label="2">品牌</el-radio-button>
        </el-radio-group>
      </div>
    </sub-title>

    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import {RadioButton} from 'element-ui'

import echarts from 'echarts'
require('echarts/theme/macarons')

import ChartsBox from '@/container/charts/product/charts-box'

import {price} from '@/const/filter'

export default {
  components: {
    'el-radio-button': RadioButton
  },
  props: {
    totalMoney: {
      type: [String, Number],
      default: 0
    },
    brandList: {
      type: Array,
      default: _ => []
    },
    categoryList: {
      type: Array,
      default: _ => []
    }
  },
  watch: {
    categoryList: {
      handler() {
        this.change(1)
      }
    }
  },
  data() {
    return {
      chart: null,
      displayData: '1'
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    change(val) {
      let data =
        val == 1 ? [].concat(this.categoryList) : [].concat(this.brandList)

      if (data.length > 5) {
        let left = data.splice(0, 5)
        let right = data.reduce(
          (prev, item) => {
            prev.value += item.value
            prev.percent += item.percent
            return prev
          },
          {name: '其他', value: 0, percent: 0}
        )

        data = left.concat(right)
      }

      this.setOptions(data)
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.setOptions(this.categoryList)
    },
    setOptions(data) {
      let options = {
        title: {
          text: '销售额',
          subtext: `¥${this.totalMoney}`,
          textAlign: 'center',
          top: '42%',
          left: '24%',
          textStyle: {
            fontSize: 12,
            color: '#929292'
          },
          subtextStyle: {
            fontSize: 18,
            color: '#272727'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ￥{c} ({d}%)'
        },
        legend: {
          show: data.length > 0,
          type: 'plain',
          orient: 'vertical',
          right: 10,
          top: 'middle',
          // selectedMode: false, //控制图例是否可交互
          formatter(name) {
            let item = data.find(i => i.name == name)

            name = name.length > 5 ? `${name.substring(0, 5)}…` : name

            return item
              ? `{title|${name}} {value|| ${parseInt(
                  item.percent * 100
                )}%} {unit|￥${price(item.value, true)}}`
              : ''
          },
          textStyle: {
            color: '#272727',
            lineHeight: 30,
            rich: {
              title: {
                width: 100,
                fontSize: 14
              },
              value: {
                width: 30,
                color: '#bbb',
                fontSize: 14
              },
              unit: {
                width: 100,
                align: 'right',
                fontSize: 14
              }
            }
          },
          icon: 'circle'
        },
        series: [
          {
            name: '商品金额占比',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'inside',
                formatter: '{b} \n {d}%'
              }
            },
            data: data
          }
        ]
      }

      this.chart.setOption(options)
    }
  }
}
</script>

<style lang="less">
.amount-chart {
  .subtitle {
    border-bottom: 1px solid #ddd;

    /deep/ .sub-title {
      padding-right: 0;
    }
  }

  .chart {
    width: 550px;
    height: 300px;
  }
}
</style>
