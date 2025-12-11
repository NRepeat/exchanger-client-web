<template>
  <div class="under-header four-wr" style="min-height:81vh">
    <div class="four four-second">
      <div class="container text-center">
        <p>
          <img src="~assets/img/error.png" alt="error" />
        </p>
        <p class="four-second-break">
          {{ $t("page.reset_password.reset_password") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  data() {
    return {
      pass: {
        password: "",
        token: this.$route.params.token,
        repeat: ""
      }
    };
  },
  computed: {
    ...mapGetters({load: "user/load"})
  },
  created() {
    this.$router.push({path: this.localePath(`/`), query: {token: this.pass.token}});
    this.reset(true);
  },
  methods: {
    ...mapMutations({reset: "user/reset"})
  }
};
</script>
