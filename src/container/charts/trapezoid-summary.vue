<template>
  <div class="trapezoid-summary">
    <el-row
      class="trapezoid-row"
      v-for="(obj, objKey, index) in data"
      :key="index"
    >
      <el-col class="row-right" :span="10" :offset="2">
        <p class="line" :style="{width: '50%'}"></p>
        <div class="content-box">
          <div class="triangle-left" :style="classLigthRigth(index, 'left')">
            <transition-arrow
              v-if="index !== 0"
              :size="initSize()"
              :position="initPosition()"
            >
              <div slot="transition-num" class="transition-num">
                <p>转化率</p>
                <p>{{ obj['conversionRate'] }}%</p>
              </div>
            </transition-arrow>
            <transition-arrow
              v-if="index == 0 && dataLength !== 2"
              :size="initSize(1.6 * rowHeight, dataLength * rowHeight)"
              :position="initPosition(15, -rowHeight)"
            >
              <div slot="transition-num" style="color:#000;">
                <div slot="transition-num" class="transition-num">
                  <p>转化率</p>
                  <p>{{ obj['conversionRate'] }}%</p>
                </div>
              </div>
            </transition-arrow>
          </div>
          <div class="rectan-center" :style="calssCenter(index)">
            <!-- <span>
            <i class="el-icon-view"></i>
          </span> -->
            <span>{{ `${KIND_EUM[objKey]}` }}</span>
          </div>
          <div
            class="triangle-right"
            :style="classLigthRigth(index, 'right')"
          ></div>
        </div>
      </el-col>
      <el-col class="row-left" :span="10">
        <div
          class="key-base"
          v-for="(value, key) in obj"
          :key="key"
          v-if="!(key == 'conversionRate' || key == 'state')"
        >
          <p style="color:rgba(174, 174, 174, 0.8);">
            {{ KIND_EUM[objKey] && KIND_KEY_SHOW(KIND_EUM[objKey])[key] }}
          </p>
          <p>{{ value }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const COLOR_EUM = {
  0: '#576DE7',
  1: '#8B74F2',
  2: '#A37EEF',
  3: '#C289EB',
  4: '#D691E8'
}
const KIND_EUM = {
  product: '商品总访客',
  login: '访客总数',

  shopCart: '加入购物车人数',
  order: '下单人数',
  pay: '支付人数'
}

const ICON_KEY = {
  receive: 'el-icon-s-opportunity',
  participate: 'el-icon-user',
  product: 'el-icon-wallet',
  verification: 'el-icon-s-claim'
}

const KIND_KEY_SHOW = function(type) {
  const obj = {
    totalCount: `${type}`,
    averageCount: `日均${type}人数`,
    percent: `与历史“日均${type}人数”平均水平相比`,
    yesterday: `昨日${type}人数`
  }
  return obj
}

const STATE_ARROW_CALSS = {
  0: 'el-icon-top',
  1: 'el-icon-minus',
  2: 'el-icon-bottom'
}

import TransitionArrow from './transition-arrow'
export default {
  name: 'trapezoid-summary',
  components: {
    'transition-arrow': TransitionArrow
  },
  props: {
    minWidth: {
      type: Number,
      default: () => 100
    },
    maxWidth: {
      type: Number,
      default: () => 130
    },
    data: {
      type: Object,
      required: true
    },
    rowHeight: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      topSize: {
        width: '100px',
        height: '300px'
      },
      topPosition: {
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    dataLength() {
      return Object.keys(this.data).length
    },
    triangleWidth() {
      const n = this.dataLength
      const min = this.minWidth
      const max = this.maxWidth
      return ((max - min) / n) * 5
    },
    initSize() {
      return (width, height) => {
        const size = {
          width: (width || this.rowHeight) + 'px',
          height: (height || this.rowHeight) + 'px'
        }
        return size
      }
    },
    initPosition() {
      return (left, top) => {
        const position = {
          right: (left || this.triangleWidth * 1.4) + 'px',
          top: (top || -this.rowHeight * 1.5) + 'px'
        }
        return position
      }
    },
    calssCenter() {
      return n => {
        // 倒叙处理
        const color = COLOR_EUM[n]
        const reseve = this.dataLength - (n + 1)
        const style = {
          width: this.minWidth + reseve * 2 * this.triangleWidth + 'px',
          minHeight: this.rowHeight + 'px',
          backgroundColor: color
        }
        return style
      }
    },
    classLigthRigth() {
      return (n, type) => {
        const color = COLOR_EUM[n]
        const style = {
          width: 0,
          height: 0,
          borderTop: this.rowHeight + 'px' + ' ' + 'solid' + ' ' + color
        }
        const key = type == 'left' ? 'borderLeft' : 'borderRight'
        const value =
          this.triangleWidth + 'px' + ' ' + 'solid' + ' ' + 'transparent'
        style[key] = value
        return this.getInnerClass(style)
      }
    }
  },
  created() {
    this.COLOR_EUM = COLOR_EUM
    this.KIND_EUM = KIND_EUM
    this.KIND_KEY_SHOW = KIND_KEY_SHOW
    this.STATE_ARROW_CALSS = STATE_ARROW_CALSS
    this.ICON_KEY = ICON_KEY
  },
  methods: {
    getInnerClass(obj) {
      return Object.keys(obj).reduce((cur, next) => {
        cur += `${next}:${obj[next]};`
        return cur
      }, '')
    }
  }
}
</script>
<style lang="less" scoped>
.trapezoid-summary {
  .trapezoid-row {
    display: flex;
    justify-content: start;

    .triangle-right,
    .triangle-left {
      position: relative;

      .transition-num {
        color: #ccc;
        position: absolute;
        bottom: 32px;
        left: 10px;

        > p {
          font-size: 8px;
          height: 10px;
        }
      }
    }

    .row-left {
      display: flex;
      border-bottom: 1px solid rgba(174, 174, 174, 0.8);
      align-items: flex-end;
      flex-direction: column;
      text-align: right;
      padding-right: 20px;

      div {
        width: 30%;
      }
    }

    .row-right {
      text-align: center;
      position: relative;

      .line {
        display: block;
        position: absolute;
        width: 125px;
        border-bottom: 1px solid rgba(174, 174, 174, 0.8);
        right: 0;
        bottom: 0;
      }

      .content-box {
        display: inline-block;
        margin: auto;
        min-width: auto;
        min-height: 100%;
        line-height: 40px;

        .rectan-center {
          font-size: 12px;
          position: relative;

          span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            line-height: 12px;
            width: 100%;
          }
        }

        > div {
          position: relative;
          float: left;
          color: #fff;
        }
      }
    }
  }
}
</style>
