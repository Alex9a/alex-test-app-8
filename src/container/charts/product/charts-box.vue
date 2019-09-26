<template>
  <div class="charts-box">
    <p class="title">
      <span>{{ name }}</span>
      <span>1</span>
    </p>
    <p class="main-amount">
      {{ amount }}
    </p>
    <p class="chart"><slot></slot></p>
    <p class="sub-amount">
      {{ subAmount }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    amount: {
      type: [String, Number]
    },
    subAmount: {
      type: [String, Number]
    }
  }
}
</script>

<style lang="less" scoped>
.charts-box {
  border: 1px solid #e9e9e9;
  padding: 15px 20px 10px;
  display: inline-block;
  min-width: 380px;

  .title {
    color: #929292;
    display: flex;
    justify-content: space-between;

    span:last-child {
      border: 1px solid #929292;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      line-height: 18px;
      box-sizing: border-box;
      text-align: center;
    }
  }

  .main-amount {
    color: #272727;
    font-size: 30px;
    border-width: bold;
  }

  .chart {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
  }

  .sub-amount {
    border-top: 1px solid #e9e9e9;
    color: #929292;
    padding-top: 10px;
  }
}
</style>
