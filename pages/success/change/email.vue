<template>
  <div class="under-header four-wr" style="min-height:81vh">
    <div class="four four-second">
      <div class="container text-center">
        <p><img src="~assets/img/yvedomlenie.svg" alt="" width="80px" /></p>
        <p class="four-second-break">
          {{ $t("page.exchange.redirect.account_email_success.success") }}
        </p>
        <p class="four-second-dont-worry">
          {{ $t("page.exchange.redirect.account_email_success.dont_worry") }}
        </p>
        <div>
          <nuxt-link :to="localePath(`/`)" class="btn btn-submit">
            {{ $t("ui.buttons.back") }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  created() {
    setTimeout(() => {
      this.$router.push(this.localePath(`/`));
    }, 5000);
    // this.$store.dispatch("notify/add", {
    //   message: this.$t("page.exchange.redirect.account_email_change.success")
    // }); //need to check
  }
};
</script>
