<template>
  <div class="policy-item">
    <el-form
      label-suffix="："
      size="mini"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="优惠内容">
        <span v-for="(name, nindex) in data.rules" class="mr10" :key="nindex">{{
          name.policyName
        }}</span>
      </el-form-item>
      <el-form-item label="参与范围">
        <span v-for="(value, key, index) in cateList" :key="index">
          <div
            class="box-item"
            v-for="(brand, bkey, bindex) in value"
            :key="bindex"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="brand.goods.map(item => item.name).join(',')"
              placement="top-end"
            >
              <span>
                <span class="box-label">分类：</span>{{ key }}
                <span class="box-label ml10">品牌：</span>{{ brand.name }}
              </span>
            </el-tooltip>
          </div>
        </span>
      </el-form-item>
      <el-form-item label="不参与范围">
        <!-- <div class="box-item">
          <span class="box-label">商品：</span>潘婷脂油修护液125ml /
          6934319101872
        </div> -->
        -
      </el-form-item>
      <el-form-item
        label="叠加策略"
        v-if="POLICY_TYPE.deduction != data.type && selectList.length > 0"
      >
        <el-select
          v-model="fusion"
          placeholder="请选择叠加策略"
          clearable
          v-if="!readonly"
        >
          <el-option label="不叠加" :value="null"> </el-option>
          <el-option
            v-for="(item, index) in selectList"
            :key="index"
            :disabled="item.disabled"
            :label="item.title"
            :value="item.strategyId"
          >
          </el-option>
        </el-select>
        <div v-else>
          {{ (data.fusion && data.fusion.title) || '-' }}
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {POLICY_TYPE} from '@/const/activity.js'

export default {
  name: 'PolicyItem',
  props: {
    data: {
      type: Object,
      default() {
        return {
          goods: []
        }
      }
    },
    cateList: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    index: {
      type: Number
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fusion(val) {
      this.$emit('fusionChange', val, this.index)
    }
  },
  data() {
    return {
      POLICY_TYPE,
      fusion: ''
    }
  },
  computed: {
    selectList() {
      // 筛选出满减的策略
      return this.list
        .filter(item => item.type == POLICY_TYPE.deduction)
        .map(item => {
          // 检查是否有重合的商品
          let ids = item.goods.map(g => g.id),
            formIds = this.data.goods.map(g => g.id),
            disabled =
              Array.from(new Set([].concat(ids, formIds))).length ===
              ids.length + formIds.length

          return {
            ...item,
            title: `${item.title}${disabled ? ' 【商品范围不满足】' : ''}`,
            disabled: disabled
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.policy-item {
  .box-item {
    display: inline-block;
    padding: 0 10px;
    margin: 0 10px 2px 0;
    border: 1px solid #ddd;

    .box-label {
      color: #bbb;
    }
  }
}
</style>
