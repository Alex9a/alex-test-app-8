<template>
  <div class="commodity-sales" v-loading="loading">
    <div class="sale">
      <!-- 商品库存销量 -->
      <sub-title>
        <span>商品库存销量</span>
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

      <stock-sale v-bind="productData"></stock-sale>
    </div>

    <div class="sale-box">
      <div class="sale-rank">
        <!-- 商品件数占比 -->
        <goods-chart :list="sellWellList"></goods-chart>

        <!-- 畅销商品排行 -->
        <sales-list name="畅销商品排行" :list="sellWellList"></sales-list>

        <!-- 高毛利率商品排行 -->
        <!-- <sales-list
          name="高毛利率商品排行"
          :list="GrossProfitData"
        ></sales-list>-->
      </div>
    </div>

    <div class="chart-box">
      <div class="chart-inner">
        <!-- 商品金额占比 -->
        <amount-chart
          :totalMoney="productData.totalMoney"
          :categoryList="productData.categoryList"
          :brandList="productData.brandList"
        ></amount-chart>

        <!-- 商品总销售金额排行 -->
        <sales-list name="商品总销售金额排行" :list="saleAmountList"></sales-list>
      </div>
    </div>
  </div>
</template>

<script>
import StockSale from './stock-sale'
import SalesList from './sales-list'
import AmountChart from './amount-chart'
import GoodsChart from './goods-chart'

import {otherCenter} from '@/const/api.js'

import {price} from '@/const/filter'

// 毛利率商品写死
const GOODS = [
  '迪奥小姐花漾淡香氛50MLEDT',
  '范思哲晶钻女士香水30MLEDT',
  '古驰花悦女士香水30MLEDP',
  '科颜氏亚马逊白泥净肤面膜125ml',
  '贝佳斯矿物营养泥浆膜（绿泥）',
  '★DHC蝶翠诗橄榄卸妆油200ML',
  '蝶翠诗草莓果香护唇膏1.5g',
  '伊丽莎白雅顿绿茶蜜滴身体霜',
  '伊丽莎白雅顿复合水凝霜',
  '兰蔻新精华肌底液50ML'
]

export default {
  components: {
    StockSale,
    SalesList,
    AmountChart,
    GoodsChart
  },
  data() {
    return {
      GrossProfitData: GOODS.map(v => ({
        name: v,
        value: '48.53%'
      })),
      timer: [],
      productData: {},
      sellWellList: [],
      saleAmountList: [],
      loading: false
    }
  },
  computed: {
    ID() {
      return +this.$route.query.id
    }
  },
  mounted() {
    // this.getProductData()
  },
  methods: {
    resetData() {},
    getProductData() {
      this.loading = true

      this.$axios
        .$post(`${otherCenter.getGoodsAnalyseData}?activityId=${this.ID}`)
        .then(res => {
          this.loading = false
          if (res.code == 0) {
            // 商品库存销量
            this.productData = res.payload

            try {
              //畅销商品
              this.sellWellList = res.payload.sellWellList.map(i => ({
                name: i.name,
                value: `${i.value}件`
              }))
            } catch (e) {
              this.sellWellList = []
            }

            try {
              //总销售金额排行
              this.saleAmountList = res.payload.saleAmountList.map(i => ({
                name: i.name,
                value: `￥${price(i.value)}`
              }))
            } catch (e) {
              this.saleAmountList = []
            }
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

<style lang="less">
.commodity-sales {
  min-width: 1200px;

  .box-style {
    background: #fff;
    padding: 5px 20px 20px;
    box-sizing: border-box;
    margin-top: 14px;
  }

  .sale {
    .box-style();
  }

  .sale-box {
    .box-style();

    padding: 20px;

    .sale-rank {
      min-width: 760px;
      max-width: 90%;
      margin: 14px auto 0;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
    }
  }

  .chart-box {
    .box-style();

    .chart-inner {
      display: flex;
      justify-content: space-between;
      min-width: 760px;
      max-width: 90%;
      margin: 14px auto 0;
      padding: 0 20px;
    }
  }
}
</style>
