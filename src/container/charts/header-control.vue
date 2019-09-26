<template>
  <div class="header-control">
    <div class="left-side">
      <div class="tabs">
        <div
          class="tab"
          @click="activeTab = index"
          :class="{active: activeTab == index}"
          v-for="(i, index) in tabList"
          :key="index"
        >
          {{ i.label }}
        </div>
      </div>
    </div>
    <div class="right-side">
      <!-- <el-select v-model="form.type" placeholder="请选择活动类型">
        <el-option
          v-for="item in POLICY_LIST"
          :key="item.type"
          :label="item.name"
          :value="item.type"
        ></el-option>
      </el-select> -->

      <!-- <el-select v-model="form.activityId" placeholder="请选择活动">
        <el-option label="买三送一" :value="0"> </el-option>
        <el-option label="买二送一" :value="1"> </el-option>
      </el-select> -->
    </div>
  </div>
</template>

<script>
import {POLICY_LIST} from '@/const/activity.js'

export default {
  name: 'header-control',
  data() {
    return {
      POLICY_LIST,
      activeTab: 0,
      tabList: [{label: '活动分析'}, {label: '商品分析'}],
      form: {
        type: 0,
        activityId: 0
      }
    }
  },
  props: {
    value: {
      type: [String, Number]
    }
  },
  watch: {
    form: {
      handler(val) {
        // TODO 通知图表刷新
      },
      immediate: true,
      deep: true
    },
    value: {
      handler(val) {
        this.activeTab = val
      },
      immediate: true
    },
    activeTab(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.header-control {
  min-width: 1000px;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;

  .left-side {
    .tabs {
      display: flex;

      .tab {
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid transparent;
        width: 90px;
        margin-top: 7px;
        text-align: center;
        margin-right: 20px;
        box-sizing: border-box;
        user-select: none;
        transition: color 0.3s ease, border-color 0.3s ease;

        &:hover {
          cursor: pointer;
        }

        &.active {
          color: @primary-color;
          border-bottom-color: @primary-color;
        }
      }
    }
  }
}
</style>
