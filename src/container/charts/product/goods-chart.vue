<template>
  <div class="goods-chart">
    <sub-title class="subtitle">商品件数占比</sub-title>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

import {price} from '@/const/filter'

export default {
  props: {
    list: {
      type: Array,
      default: _ => []
    }
  },
  watch: {
    list: {
      handler(val) {
        let data = val.map(i => ({name: i.name, value: parseInt(i.value)}))
        // TODO: 5件以上纳入其他

        if (data.length > 5) {
          let left = data.splice(0, 5)
          let right = data.reduce(
            (prev, item) => {
              prev.value += item.value
              return prev
            },
            {name: '其他', value: 0}
          )

          data = left.concat(right)
        }

        val.length > 0 && this.setOptions(data)
      }
    }
  },
  computed: {
    // 总商品数
    totalLength() {
      return this.list.reduce((prev, item) => {
        return prev + parseInt(item.value)
      }, 0)
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  // beforeDestroy() {
  //   if (!this.chart) return
  //   this.chart.dispose()
  //   this.chart = null
  // },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      // this.setOptions(this.list)
    },
    setOptions(data) {
      let options = {
        title: {
          text: '总件数',
          subtext: `${this.totalLength}件`,
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
          formatter: '{a} <br/>{b}: {c}件 ({d}%)'
        },
        legend: {
          show: data.length > 0,
          type: 'plain',
          orient: 'vertical',
          right: 10,
          top: 'middle',
          // selectedMode: false, //控制图例是否可交互
          formatter: name => {
            let item = data.find(i => i.name == name)

            name = name.length > 5 ? `${name.substring(0, 5)}…` : name

            let percent = parseInt(
              (parseInt(item.value) / this.totalLength) * 100
            )

            return item
              ? `{title|${name}} {value|| ${percent}%} {unit|${item.value}件}`
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
                width: 40,
                color: '#bbb',
                fontSize: 14
              },
              unit: {
                width: 60,
                align: 'right',
                fontSize: 14
              }
            }
          },
          icon: 'circle'
        },
        series: [
          {
            name: '商品件数占比',
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
.goods-chart {
  .subtitle {
    border-bottom: 1px solid #ddd;
  }

  .chart {
    width: 550px;
    height: 300px;
  }
}
</style>
