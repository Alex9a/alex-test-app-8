<template>
  <div class="views-chart">
    <charts-box v-bind="$attrs">
      <div class="chart" ref="chart"></div>
    </charts-box>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

import ChartsBox from '@/container/charts/product/charts-box'

export default {
  components: {
    ChartsBox
  },
  data() {
    return {
      chart: null
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
    initChart() {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      this.setOptions()
    },
    setOptions() {
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            axis: 'y',
            label: {
              backgroundColor: '#975FE4'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false
        },
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            // smooth: true,
            lineStyle: {
              color: '#975FE4'
            },
            itemStyle: {
              normal: {
                color: '#975FE4'
              }
            },
            areaStyle: {
              color: '#975FE4'
            },
            data: Array.from(new Array(15), () =>
              parseInt(Math.random() * 1000)
            )
          }
        ]
      }

      this.chart.setOption(options)
    }
  }
}
</script>

<style lang="less" scoped>
.views-chart {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
