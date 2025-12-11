<template>
  <div v-if="state">
    <push
      v-for="(n, i) in filterNote"
      :key="i"
      :style="{top: i !== 0 ? i * 100 + 'px' : '', cursor: 'pointer', borderRadius: '4px'}"
      :data-notification-status="n.type"
      :message="n.message"
      :class="n.position"
      :timeout="timeout"
      :code="n.code"
      class="notify"
    />
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import push from "./push";

export default {
  components: {push},
  data() {
    return {
      state: true,
      open: false
    };
  },
  computed: {
    ...mapGetters({
      notifies: "notify/notifies",
      timeout: "notify/timeout",
      backup: "notify/backup"
    }),
    arr() {
      return this.open ? this.backup : this.notifies;
    },
    filterNote() {
      return this.arr.slice(this.arr.length > 4 ? this.arr.length - 5 : 0, this.arr.length);
    }
  },
  watch: {
    notifies() {
      this.state = false; // yan?
      this.state = true;
    }
  }
};
</script>
