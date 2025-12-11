<template>
  <div class="under-header four-wr" style="min-height:81vh">
    <div class="four four-second">
      <div class="container text-center">
        <p><img src="~assets/img/error.png" alt="" /></p>
        <p class="four-second-break">{{ $t("page.exchange.redirect.account_activate_success.success") }}</p>
        <p class="four-second-dont-worry">{{ $t("page.exchange.redirect.account_activate_success.dont_worry") }}</p>
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
import login from "~/components/header/logosign";

export default {
  components: {login}
};
</script>
