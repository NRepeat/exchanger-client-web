<template>
  <div class="under-header four-wr" style="min-height:81vh">
    <div class="four four-second">
      <div class="container text-center">
        <p><img src="~assets/img/error.png" alt="" /></p>
        <p class="four-second-break">{{ $t("page.exchange.redirect.account_activate_error.error") }}</p>

        <p class="four-second-dont-worry">{{ $t("page.exchange.redirect.account_activate_error.dont_worry") }}</p>
        <div>
          <nuxt-link :to="localePath(`/news/`)" class="btn btn-submit">
            {{ $t("ui.buttons.news_link") }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
};
</script>
