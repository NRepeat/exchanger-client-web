<template>
  <transition name="slide">
    <div v-if="$route.name !== 'lang-technical-work'" @click="instDel">{{ message }}</div>
  </transition>
</template>
<script>
import {mapMutations} from "vuex";

export default {
  props: {
    message: {type: String, default: ""},
    timeout: {type: Number, default: 1000},
    code: {type: [Number, String], default: ""}
  },
  data() {
    return {
      state: true,
      time: ""
    };
  },
  created() {
    this.time = setTimeout(() => this.del(), this.timeout);
  },
  beforeDestroy() {
    clearTimeout(this.time);
  },
  methods: {
    ...mapMutations("notify", ["del"]),
    instDel() {
      clearTimeout(this.time);
      this.del(this.item);
    }
  }
};
</script>
<style scoped>
@import "./push.scss";
</style>
