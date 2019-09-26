<template>
  <el-button
    icon="el-icon-arrow-left"
    type="text"
    class="back-button"
    @click="$router.back()"
    >返回</el-button
  >
</template>

<script>
export default {
  name: 'GoBack'
}
</script>
<style lang="less">
@import '~assets/var.less';

.back-button {
  color: @primary-color;
}
</style>
