<template>
  <div id="preloader" :style="responsive ? {display: 'flex', justifyContent: 'center', position: 'relative'} : {}">
    <div
      id="loader"
      :style="
        responsive
          ? {height: height ? height + 'px' : '', margin: '0', top: '0', left: '0', width: width ? width + 'px' : ''}
          : {}
      "
    />
  </div>
</template>
<script>
export default {
  props: {
    responsive: {type: Boolean, default: false},
    height: {type: [Number, String], default: 0},
    width: {type: [Number, String], default: 0}
  }
};
</script>

<style scoped>
@import "./loader.scss";
</style>
