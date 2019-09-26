<template>
  <div class="basic-setting">
    <el-form
      class="form"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-suffix="："
    >
      <el-form-item label="活动名称" prop="name">
        <el-input
          v-if="!readonly"
          placeholder="请输入活动名称"
          v-model="form.name"
        ></el-input>

        <span v-else>{{ data.name }}</span>
      </el-form-item>

      <el-form-item label="活动类型" prop="type">
        <el-radio-group v-model="form.type" v-if="!readonly">
          <el-radio
            :label="item.value"
            v-for="item in ACTIVITY_TYPE_LIST"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>

        <span v-else>{{ ACTIVITY_TYPE[data.type] }}</span>
      </el-form-item>

      <el-form-item label="活动目的" prop="purpose">
        <el-select
          v-if="!readonly"
          v-model="form.purpose"
          placeholder="请选择活动目的"
          class="mr10"
        >
          <el-option label="提升业绩" value="0" disabled></el-option>
          <el-option label="降低库存" value="1"></el-option>
        </el-select>
        <span class="mr10" v-else>{{ PURPOSE_MAP[data.purpose] }}</span>

        <template v-if="form.purpose == 1 || readonly">
          库存范围：库存大于
          <el-input-number
            v-if="!readonly"
            class="aim-input ml10 mr10"
            controls-position="right"
            v-model="form.minStock"
            :min="0"
          ></el-input-number>
          <span class="ml10 mr10" v-else>{{ data.minStock }}</span>
          个以上的商品
          <el-button class="ml10" icon="el-icon-search">查看库存</el-button>
        </template>
      </el-form-item>

      <el-form-item label="活动范围">
        <el-radio-group disabled v-if="!readonly">
          <el-radio label="1">提定区域</el-radio>
          <el-radio label="2">指定门店</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动对象" prop="userType">
        <el-radio-group v-model="form.userType" v-if="!readonly">
          <el-radio label="1">所有人</el-radio>
          <el-radio label="2">指定</el-radio>
        </el-radio-group>
        <span v-else>所有人</span>
      </el-form-item>

      <el-form-item label="活动时间" prop="startTime">
        <el-date-picker
          v-if="!readonly"
          :picker-options="pickerOptions"
          v-model="dateTime"
          type="datetimerange"
          start-placeholder="活动开始日期"
          end-placeholder="活动结束日期"
        >
        </el-date-picker>
        <span v-else>{{
          `${formatDate(data.startTime, 'YYYY-MM-DD HH:mm:ss')} - ${formatDate(
            data.endTime,
            'YYYY-MM-DD HH:mm:ss'
          )}`
        }}</span>
      </el-form-item>

      <el-form-item label="活动描述" prop="description">
        <el-input
          v-if="!readonly"
          type="textarea"
          :rows="4"
          placeholder="请输入活动描述"
          v-model="form.description"
        >
        </el-input>
        <span v-else>{{ data.description }}</span>
      </el-form-item>
    </el-form>

    <div class="btn-control" v-if="!readonly">
      <el-button type="primary" @click="onSubmit">下一步</el-button>
    </div>
  </div>
</template>

<script>
import {
  ACTIVITY_TYPE,
  ACTIVITY_TYPE_LIST,
  PURPOSE_MAP
} from '@/const/activity.js'

import {formatDate} from '@/const/filter.js'

const ONE_DAY = 24 * 60 * 60 * 1000

export default {
  name: 'BasicSetting',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const stockValid = (rule, value, callback) => {
      if (this.form.minStock == '') {
        return callback(new Error('请输入库存限制'))
      }

      callback()
    }

    return {
      ACTIVITY_TYPE,
      ACTIVITY_TYPE_LIST,
      PURPOSE_MAP,
      pickerOptions: {
        disabledDate: time => {
          //禁用过去的时间 不包括今天
          return time.getTime() < Date.now() - ONE_DAY
        }
      },
      dateTime: [],
      form: {
        name: '', //活动名称
        type: '0', //活动类型
        purpose: '', //活动目的
        userType: '1', //活动对象
        users: [], //用户对象
        startTime: '', //开始时间
        endTime: '', //结束时间
        description: '', //活动描述
        minStock: '' //最小库存
      },
      rules: {
        name: {required: true, message: '请输入活动名称', trigger: 'blur'},
        type: {required: true, message: '请选择活动类型', trigger: 'change'},
        purpose: [
          {required: true, message: '请选择活动目的', trigger: 'change'},
          {
            validator: stockValid,
            trigger: 'change'
          }
        ],
        userType: {
          required: true,
          message: '请选择活动对象',
          trigger: 'change'
        },
        startTime: {
          required: true,
          message: '请选择活动时间',
          trigger: 'change'
        }
      }
    }
  },
  watch: {
    dateTime(val) {
      if (val) {
        let startTime = +new Date(val[0]),
          endTime = +new Date(val[1])

        this.form.startTime = startTime
        this.form.endTime = endTime
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    }
  },
  methods: {
    formatDate,
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('handleStepChange', Object.assign({}, this.form))
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.basic-setting {
  .form {
    width: 850px;
  }

  .btn-control {
    width: 100px;
  }

  .aim-input {
    width: 100px;
  }
}
</style>
