<template>
  <div class="policy-list">
    <el-collapse v-model="activeNames">
      <template v-for="(item, index) in list">
        <el-collapse-item :name="index" :key="index" class="col-item">
          <template slot="title">
            <el-tag>{{ POLICY_TYPE_MAP[item.type] }}</el-tag>
            <span class="title" v-show="activeNames.indexOf(index) == -1">
              <span class="policy-name">
                <span v-if="item.isOriginPrice">【正价商品】</span>
                <span
                  v-for="(name, nindex) in item.rules"
                  class="mr10"
                  :key="nindex"
                  >{{ name.policyName }}</span
                >
              </span>

              <span class="brand-name">
                <span
                  v-for="(value, key, index) in getCateList(item.goods)"
                  :key="index"
                >
                  <span v-for="(brand, bkey, bindex) in value" :key="bindex">
                    【分类：{{ key }}&nbsp;&nbsp;品牌：{{ brand.name }}】
                  </span>
                </span>
              </span>
            </span>

            <span
              class="expand-item"
              style="padding-left: 20px;"
              v-if="item.fusion && activeNames.indexOf(index) != -1"
            >
              此策略享受后，还可享受: 【{{
                item.fusion.rules.map(i => i.policyName).join('，')
              }}】优惠
            </span>
          </template>

          <policy-item
            :readonly="readonly"
            @fusionChange="fusionChange"
            :data="item"
            :list="list"
            :index="index"
            :cateList="getCateList(item.goods)"
          ></policy-item>

          <el-button
            v-if="!readonly"
            v-show="activeNames.indexOf(index) > -1"
            type="danger"
            icon="el-icon-delete"
            circle
            class="delete"
            @click="onDelete(index)"
          ></el-button>
        </el-collapse-item>

        <div
          class="expand-item"
          v-if="item.fusion && activeNames.indexOf(index) == -1"
        >
          此策略享受后，还可享受: 【{{
            item.fusion.rules.map(i => i.policyName).join('，')
          }}】优惠
        </div>
      </template>
    </el-collapse>
  </div>
</template>

<script>
import PolicyItem from './policy-item'

import {Tag, Collapse, CollapseItem} from 'element-ui'

import {POLICY_TYPE_MAP} from '@/const/activity'

export default {
  name: 'PolicyList',
  components: {
    PolicyItem,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem,
    'el-tag': Tag
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    isExpandAll: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: [],
      POLICY_TYPE_MAP
    }
  },
  watch: {
    isExpandAll: {
      handler(val) {
        if (val) this.activeNames = this.list.map((v, i) => i)
      },
      immediate: true
    }
  },
  methods: {
    fusionChange(val, index) {
      this.$emit('fusionChange', val, index)
    },
    getCateList(data) {
      return data.reduce((sum, item) => {
        if (!sum[item.categoryName]) {
          //不存在该分类
          sum[item.categoryName] = {
            [item.brandName]: {
              name: item.brandName,
              goods: [item]
            }
          }
        } else {
          if (!sum[item.categoryName][item.brandName]) {
            sum[item.categoryName][item.brandName] = {
              name: item.brandName,
              goods: [item]
            }
          } else {
            sum[item.categoryName][item.brandName]['goods'] = sum[
              item.categoryName
            ][item.brandName]['goods'].concat(item)
          }
        }
        return sum
      }, {})
    },
    onDelete(index) {
      this.$confirm('确认移除该活动策略吗？')
        .then(res => {
          if (res == 'confirm') {
            this.$emit('onDelete', index)
          }
        })
        .catch(() => {})
    },
    expandAll() {
      if (this.activeNames.length == this.list.length) {
        this.activeNames = []
      } else {
        this.activeNames = this.list.map((v, i) => i)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.policy-list {
  .policy-name {
    margin-left: 10px;
  }

  .title {
    display: flex;
    width: 90%;
    justify-content: space-between;

    .policy-name {
      width: 50%;
      .text-overflow();
    }

    .brand-name {
      color: #bbb;
      width: 40%;
      text-align: right;
      .text-overflow();
    }
  }

  .col-item {
    position: relative;

    .delete {
      position: absolute;
      top: 50%;
      right: 50px;
      transform: translateY(-50%);
    }
  }

  .expand-item {
    line-height: 40px;
    color: #f96;
  }
}
</style>
