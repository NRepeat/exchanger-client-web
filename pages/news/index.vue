<template>
  <div>
    <div class=" news-page-top-wr">
      <div class="container news-page-top">
        <h1>{{ $t("page.news.title") }}</h1>
        <p v-if="false">######################</p>
      </div>
    </div>
    <list :limit="6" />
  </div>
</template>
<script>
import list from "~/components/news/list";

export default {
  async asyncData({params, app, seo}) {

  },
  components: {list},
  head() {
    const {meta, title} = this.$seo({
      title: this.$i18n.t("meta.news.title"),
      description: this.$i18n.t("meta.news.description"),
      openGraph: {
        title: this.$i18n.t("meta.news.title"),
        description: this.$i18n.t("meta.news.description"),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath}
      }
    });
    return {meta, title};
  }
};
</script>
