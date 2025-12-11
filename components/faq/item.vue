<template>
  <li class="faq-qst-title-li">
    <p class="faq-qst-title" @click="open = !open">
      {{ title }}
      <span />
    </p>
    <div v-if="open" ref="block" class="b-toggle" v-html="content" />
  </li>
</template>
<script>
export default {
  props: {
    title: {type: String, default: ""},
    content: {type: String, default: ""}
  },
  data() {
    return {
      open: false
    };
  }
};
</script>

<style scoped>
.b-toggle {
  max-height: none;
  opacity: 1;
}
</style>
