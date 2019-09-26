<template>
  <div class="stock-sale">
    <div class="data">
      <div class="data-box">
        <div class="top-box">
          <div class="top-item">
            <p>单品售罄</p>
            <p>{{ singleSaleOver }}</p>
          </div>
          <div class="top-item">
            <p>单商品库存已降至30%</p>
            <p>{{ thirtySaleOver }}</p>
          </div>
          <div class="top-item">
            <p>单商品库存已降至50%</p>
            <p>{{ halfSaleOver }}</p>
          </div>
        </div>
        <div class="bottom-box">
          <p class="bottom-item">
            活动总库占比：{{ singleSaleOverPercent | percent }}%
          </p>

          <p class="bottom-item">
            活动总库占比：{{ thirtySaleOverPercent | percent }}%
          </p>

          <p class="bottom-item">
            活动总库占比：{{ halfSaleOverPercent | percent }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const dataType = [String, Number]

export default {
  props: {
    halfSaleOver: dataType,
    halfSaleOverPercent: dataType,
    singleSaleOver: dataType,
    singleSaleOverPercent: dataType,
    thirtySaleOver: dataType,
    thirtySaleOverPercent: dataType
  },
  filters: {
    percent(val) {
      return parseInt(val * 100) || 0
    }
  }
}
</script>

<style lang="less" scoped>
.stock-sale {
  .data {
    background: #fff;
    padding: 5px 20px 20px;
    box-sizing: border-box;
    margin-top: 14px;
  }

  .data-box {
    width: 90%;
    margin: 0 auto;
    border: 1px solid #e9e9e9;
    padding: 40px 20px 20px;

    .top-box {
      display: flex;
      justify-content: space-between;
      text-align: center;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 10px;
      margin-bottom: 20px;

      .top-item {
        width: 33%;
        color: #272727;

        p:first-child {
          font-size: 14px;
        }

        p:last-child {
          font-size: 30px;
        }
      }
    }

    .bottom-box {
      display: flex;
      justify-content: space-between;
      text-align: center;

      .bottom-item {
        width: 33%;
        font-size: 14px;
      }
    }
  }
}
</style>
