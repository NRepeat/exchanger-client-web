<template>
  <div class="container">
    <div class="text-center">
      <h1>Verification process</h1>
    </div>
    <div class="profile__main">
      <div class="user-page">
        <div class="text-center">
          <button v-if="$route.query.returnUrl" style="padding: 10px 20px;margin: 10px auto;" class="btn btn-plain"
                  @click="onCancelVerification">
            Cancel verification process
          </button>
          <button v-else style="padding: 10px 20px;margin: 10px auto;" class="btn btn-plain"
                  @click="onCancelVerification">
            Go back to profile
          </button>


          <verification-kyc />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import verificationKyc from "~/components/verification-kyc.vue"
export default {
  components: {verificationKyc},
  methods: {
    onCancelVerification() {
      if (this.$route.query.returnUrl) {
        this.$router.push(this.$route.query.returnUrl)
      } else {
        if(this.isModal) {
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
  },
}
</script>