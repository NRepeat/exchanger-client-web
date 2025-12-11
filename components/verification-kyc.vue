<template>
  <div v-if="!templateJson || !kycData" style="padding: 20px;font-size: 20px">
    Loading...
  </div>
  <div v-else style="min-height: 30px">
    <component
      :is="templateJson"
      :kyc-data="kycData"
      @success="onSuccessVerification"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  components: {},
  props: {
    isModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      templateJson: null,
      kycData: null,
    }
  },
  computed: {
    ...mapGetters({
      user: "user/info"
    })
  },
  methods: {
    ...mapActions({
      verificationInit: "user/verificationInit",
      checkAuth: "user/checkAuth",
    }),
    onCancelVerification() {
      if (this.$route.query.returnUrl) {
        this.$router.push(this.$route.query.returnUrl)
      } else {
        if (this.isModal) {
          this.$store.dispatch("notify/add", {
            message: "Verification canceled.",
            type: "error"
          });
          this.$emit('close');
          return;
        }
        this.$router.push(this.localePath(`/user/profile/`));
      }
    },
    onSuccessVerification(el) {
      console.log("{KYC} -> onSuccessVerification:", this.$route.query.returnUrl);
      if (this.$route.query.returnUrl) {
        // encodeURIComponent("/url/")


        if (this.isModal) {
          this.$store.dispatch("notify/add", {
            message: "Verification completed."
          });
          this.$emit('close');
          return;
        }
        this.$swal("", "Verification completed.", "success")
        this.$router.push(this.$route.query.returnUrl);
      }
      this.checkAuth();
    }
  },
  async created() {
    if (!process.browser) return;
    await this.checkAuth();
    const verification = await this.verificationInit()
      .catch(error => {
        this.onCancelVerification();
        this.$swal("", error.message, "error")
      });
    if (!verification) return;
    this.templateJson = JSON.parse(
      verification.template,
      function (key, value) {
        if (typeof value === "string" && value.startsWith("/Function(") && value.endsWith(")/")) {
          value = value.substring(10, value.length - 2);
          return eval("( function " + value + ")");
        }
        if (key === "type") {
          return eval(value);
        }
        return value;
      }
    )
    this.kycData = verification.data


  }
}
</script>