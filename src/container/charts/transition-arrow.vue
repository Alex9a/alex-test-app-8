<template>
  <div class="transition-arrow">
    <div class="square" :style="squareClass">
      <slot name="transition-num"></slot>
      <i class="arrow el-icon-caret-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transition-arrow',
  data() {
    return {}
  },
  props: {
    position: {
      type: Object,
      default: () => {
        return {
          top: 0,
          left: 0
        }
      }
    },
    size: {
      type: Object,
      default: () => {
        return {
          width: 25 + 'px',
          height: 25 + 'px'
        }
      }
    }
  },
  computed: {
    squareClass() {
      const style = {...this.position, ...this.size}
      style.position = 'absolute'
      return this.getInnerClass(style)
    }
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
.transition-arrow {
  .square {
    width: 25px;
    height: 25px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    position: relative;

    .arrow {
      position: absolute;
      color: #ccc;
      right: -7px;
      bottom: -7px;
    }
  }
}
</style>
