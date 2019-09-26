<template>
  <div class="sales-list" :class="{empty: list.length == 0}">
    <div class="title">{{ name }}</div>

    <div class="list-box">
      <div class="item" v-for="(item, index) in list" :key="index">
        <span class="index" :class="{light: index < 3}">{{ index + 1 }}</span>
        <span class="goods-name">{{ item.name }}</span>
        <span class="unit">{{
          item.formatter ? item.formatter(item) : item.value
        }}</span>
      </div>
      <div v-if="list.length == 0" class="no-result">
        - 暂无数据 -
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    list: {
      type: Array,
      default: _ => []
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.sales-list {
  position: relative;
  max-height: 500px;
  overflow-y: auto;

  &.empty {
    width: 380px;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    color: #000;
  }

  .item {
    line-height: 26px;
    margin-bottom: 10px;

    span {
      vertical-align: middle;
      display: inline-block;
    }
  }

  .no-result {
    position: absolute;
    top: 35%;
    left: 0;
    width: 100%;
    margin-top: 40px;
    text-align: center;
  }

  .index {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #f0f2f5;
    margin-right: 14px;

    &.light {
      background: #f99;
      color: #fff;
    }
  }

  .goods-name {
    .text-overflow();

    width: 300px;
  }
}
</style>
