<template>
  <div class="policy-setting">
    <sub-title title="添加优惠策略"></sub-title>

    <!-- 添加优惠策略 -->
    <add-policy
      @handleUpdateData="handleUpdateData"
      @onDelete="onDelete"
      :disabled="strategies.length == 2"
      :minStock="minStock"
    ></add-policy>

    <sub-title>
      <span>
        已添加的策略
        <span class="sub-text">针对库存高于{{ minStock }}件以上的商品</span>
      </span>
      <el-button type="text" @click="$refs.policyList.expandAll()"
        >全部展开</el-button
      >
    </sub-title>

    <!-- 已添加的策略 -->
    <policy-list
      class="mb10"
      ref="policyList"
      @onDelete="onDelete"
      @fusionChange="fusionChange"
      :list="strategies"
    ></policy-list>

    <div class="btn-control">
      <el-button type="primary" @click="onSubmit">下一步</el-button>
      <!-- <el-button @click="prevStep">上一步</el-button> -->
    </div>
  </div>
</template>

<script>
import AddPolicy from './add-policy'

import PolicyList from './policy-list'

export default {
  name: 'PolicySetting',
  components: {
    AddPolicy,
    PolicyList
  },
  props: {
    minStock: {
      type: [Number, String]
    }
  },
  data() {
    return {
      strategies: []
    }
  },
  methods: {
    fusionChange(val, index) {
      let data = this.strategies.find(item => item.strategyId == val) || null
      this.strategies[index].fusion = data
    },
    onSubmit() {
      if (this.strategies.length == 0) {
        this.$message.error('请添加优惠策略')
        return
      }

      this.handleStepChange()
    },
    onDelete(index) {
      this.strategies.splice(index, 1)
    },
    handleUpdateData(res) {
      this.strategies.push(res)
    },
    handleStepChange() {
      this.$emit('handleStepChange', {strategies: this.strategies})
    },
    prevStep() {
      this.$emit('prevStep')
    }
  }
}
</script>

<style lang="less" scoped>
.policy-setting {
  .sub-text {
    color: #ccc;
    font-size: 12px;
    margin-left: 4px;
  }
}
</style>
