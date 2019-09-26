<template>
  <div class="policy-dialog">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="750px"
    >
      <transition name="fade">
        <el-alert
          @close="msgClose"
          v-if="showErrorMsg"
          class="error-tip"
          :title="errorMsg"
          type="error"
        ></el-alert>
      </transition>

      <div class="content-box">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="促销标题：">
            <el-input
              class="title"
              v-model="form.title"
              placeholder="请输入促销标题"
            ></el-input>
          </el-form-item>

          <el-form-item label="优惠设置：">
            <!-- 买高送低 -->
            <send-low
              :ref="refName + POLICY_TYPE.sendLow"
              v-if="type == POLICY_TYPE.sendLow"
            ></send-low>

            <!-- 满额减额 -->
            <t-deduction
              :ref="refName + POLICY_TYPE.deduction"
              v-if="type == POLICY_TYPE.deduction"
            ></t-deduction>

            <!-- 买件送件 -->
            <send-one
              :ref="refName + POLICY_TYPE.sendOne"
              v-if="type == POLICY_TYPE.sendOne"
            ></send-one>

            <!-- 满额打折 -->
            <t-discount
              :ref="refName + POLICY_TYPE.discount"
              v-if="type == POLICY_TYPE.discount"
            ></t-discount>

            <!-- 直接打折 -->
            <direct-discount
              :ref="refName + POLICY_TYPE.direct_discount"
              v-if="type == POLICY_TYPE.direct_discount"
            ></direct-discount>
          </el-form-item>

          <el-form-item label="其他要求：">
            <p>
              <el-checkbox :value="true">不与会员折扣同享</el-checkbox>
            </p>

            <p>
              <el-checkbox :value="true">特价商品不参与此优惠</el-checkbox>
            </p>

            <p>
              参与次数：
              <el-radio-group :value="0">
                <el-radio :label="0">不限定</el-radio>
                <el-radio :label="1">按人限定</el-radio>
                <el-radio :label="2">按订单限定</el-radio>
              </el-radio-group>
            </p>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </span>
    </el-dialog>

    <goods-select
      ref="goodsSelect"
      @onSelectGoods="onSelectGoods"
      :minStock="minStock"
      :removeSpecialProduce="form.removeSpecialProduce"
    ></goods-select>
  </div>
</template>

<script>
import {Alert} from 'element-ui'

import {POLICY_TYPE, POLICY_TYPE_MAP} from '@/const/activity.js'

import SendLow from '@/container/activity/template/send-low'

import Deduction from '@/container/activity/template/deduction'

import SendOne from '@/container/activity/template/send-one'

import Discount from '@/container/activity/template/discount'

import DirectDiscount from '@/container/activity/template/direct-discount'

import GoodsSelect from '@/container/goods-select'

const DEFAULT_DATA = {
  limitTimes: false, //是否限制参与次数
  maxTimes: '', //限制次数
  isOriginPrice: false, //是否要求商品正价
  useUserDiscount: false, //是否允许享受会员折扣
  removeSpecialProduce: false, //是否排除特价商品参与
  title: '', //策略标题
  fusion: null //融合策略
}

export default {
  name: 'PolicyDialog',
  components: {
    'el-alert': Alert,
    SendLow,
    't-deduction': Deduction,
    SendOne,
    't-discount': Discount,
    GoodsSelect,
    DirectDiscount
  },
  props: {
    type: {
      type: [Number, String],
      default: 0
    },
    minStock: {
      type: Number
    }
  },
  data() {
    return {
      POLICY_TYPE,
      dialogVisible: false,
      form: {...DEFAULT_DATA},
      snapData: {},
      errorMsg: '',
      showErrorMsg: false,
      refName: 'policy',
      timer: null,
      timerWait: 3000
    }
  },
  computed: {
    title() {
      return POLICY_TYPE_MAP[this.type] || ''
    },
    isSendLow() {
      // 买高送低
      return this.type == POLICY_TYPE.sendLow
    },
    isDeduction() {
      // 满额减额
      return this.type == POLICY_TYPE.deduction
    },
    activeRef() {
      return this.$refs[this.refName + this.type]
    }
  },
  methods: {
    onSelectGoods(data) {
      this.$emit(
        'handleUpdateData',
        Object.assign({}, this.snapData, {goods: data, strategyId: +new Date()})
      )

      this.dialogVisible = false
    },
    nextStep() {
      if (this.form.title == '') {
        return this.alert('请输入促销标题')
      }

      this.activeRef
        .valid()
        .then(res => {
          // if (this.form.limitTimes) {
          //   if (this.form.maxTimes == '' || this.form.maxTimes == 0) {
          //     return this.alert('请输入享受活动次数')
          //   }
          // }
          this.snapData = Object.assign({}, this.form, {
            rules: res,
            type: this.type
          })

          this.$refs.goodsSelect.show()
        })
        .catch(msg => {
          this.alert(msg)
          this.setTimer()
        })
    },
    resetData() {
      this.form = {...DEFAULT_DATA}
    },
    setTimer() {
      window.clearTimeout(this.timer)
      this.timer = setTimeout(this.msgClose, this.timerWait)
    },
    msgClose() {
      this.showErrorMsg = false
    },
    alert(msg) {
      this.msgClose()

      this.$nextTick(function() {
        this.errorMsg = msg
        this.showErrorMsg = true
      })
    },
    show() {
      this.resetData()
      this.dialogVisible = true

      this.$nextTick(function() {
        this.activeRef.resetData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.policy-dialog {
  .error-tip {
    position: absolute;
    top: 50px;
    left: 0;
  }

  .content-box {
    padding-top: 20px;

    .title {
      width: 400px;
      margin-bottom: 20px;
    }

    .sub-test {
      color: #ccc;
    }

    .times-input {
      margin: 0 4px;
      width: 80px;
    }
  }
}
</style>
