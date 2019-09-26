<template>
  <div class="charts">
    <go-back></go-back>

    <header-control v-model="active"></header-control>

    <!-- 活动分析 -->
    <activity-analysis v-if="active == 0"></activity-analysis>

    <!-- 商品销售情况 -->
    <commodity-sales v-if="active == 1"></commodity-sales>
  </div>
</template>

<script>
import ActivityAnalysis from '@/container/charts/activity/index'

import HeaderControl from '@/container/charts/header-control'

import CommoditySales from '@/container/charts/product/index'

export default {
  components: {
    ActivityAnalysis,
    HeaderControl,
    CommoditySales
  },
  data() {
    return {
      active: 0
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserAndMenuList')
  }
}
</script>
