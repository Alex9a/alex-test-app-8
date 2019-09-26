<template>
  <div class="add-policy">
    <div class="policy-list">
      <div class="item" v-for="item in POLICY_LIST" :key="item.type">
        <p class="name">{{ item.name }}</p>
        <p class="desc" v-html="item.desc"></p>
        <p>
          <!-- :disabled="disabled" -->
          <el-button type="primary" size="mini" @click="addHandle(item.type)"
            >添加</el-button
          >
        </p>
      </div>
    </div>

    <policy-dialog
      ref="policyDialog"
      :type="selectType"
      :minStock="minStock"
      @handleUpdateData="handleUpdateData"
    ></policy-dialog>
  </div>
</template>

<script>
import {POLICY_TYPE, POLICY_LIST} from '@/const/activity'

import PolicyDialog from './policy-dialog'

export default {
  name: 'AddPolicy',
  components: {
    PolicyDialog
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    minStock: {
      type: Number
    }
  },
  data() {
    return {
      POLICY_LIST,
      POLICY_TYPE,
      selectType: 0
    }
  },
  methods: {
    addHandle(type) {
      this.selectType = type
      this.$refs.policyDialog.show()
    },
    handleUpdateData(data) {
      // 添加策略
      this.$emit('handleUpdateData', data)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.add-policy {
  .policy-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;

    .item {
      box-sizing: border-box;
      width: 18%;
      min-width: 100px;
      max-width: 200px;
      min-height: 130px;
      text-align: center;
      background: #f1f7ff;
      padding: 10px;
      margin: 0 5px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-weight: bold;
        color: #000;
        margin-bottom: 5px;
      }

      .desc {
        color: #999;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
