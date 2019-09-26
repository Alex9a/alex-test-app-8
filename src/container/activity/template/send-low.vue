<template>
  <div class="send-low">
    <!-- 买高送低 -->
    <div v-for="(item, index) in rules" class="item">
      买
      <el-input-number
        class="limit-input"
        v-model="item.quantity"
        :min="0"
        controls-position="right"
      ></el-input-number>
      件不同价，最低价商品免费
    </div>
  </div>
</template>

<script>
const DEFAULT_DATA = {
  quantity: 0,
  policyName: ''
}

export default {
  name: 'SendLow',
  components: {},
  data() {
    return {
      rules: []
    }
  },
  methods: {
    resetData() {
      this.rules = [
        {
          ...DEFAULT_DATA,
          id: +new Date()
        }
      ]
    },
    valid() {
      return new Promise((resole, reject) => {
        for (let i = 0; i < this.rules.length; i++) {
          let item = this.rules[i]

          if (item.quantity <= 0) {
            return reject('件数请输入大于0的数字')
          }

          this.rules[i].policyName = `买${
            this.rules[i].quantity
          }件不同价，“免”一件低价`
        }

        resole(JSON.parse(JSON.stringify(this.rules)))
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/var.less';

.send-low {
  margin-bottom: 40px;

  .item {
    &:not(:first-child) {
      border-top: 1px solid #ddd;
      padding-top: 20px;
      margin-top: 20px;
    }
  }

  .limit-input {
    width: 100px;
  }
}
</style>
