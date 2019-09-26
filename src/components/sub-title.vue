<template>
  <div class="sub-title-box">
    <div class="sub-title">
      {{ title }}
      <slot></slot>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'SubTitle',
  props: {
    title: {
      type: String
    }
  }
}
</script>
<style lang="less">
.sub-title-box {
  .sub-title {
    padding: 0 20px 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    margin: 20px 0;
    font-size: 15px;
    user-select: none;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 2px;
      height: 100%;
      top: 0;
      left: 0;
      background: #5d81f9;
    }
  }
}
</style>
