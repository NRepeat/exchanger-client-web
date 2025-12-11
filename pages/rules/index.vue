<template>
  <div>
    <rulesTopSection @onChangeRule="onChangeRule" />
    <div class="reviews-bloc specification-news-bloc">
      <list :pagination="false" :limit="3" />
    </div>
  </div>
</template>
<script>
import rulesTopSection from "~/components/rules/rulesTopSection";

import list from "~/components/news/list";
import {mapGetters, mapActions} from "vuex";

export default {
  async asyncData({params, app, seo}) {

  },
  head() {
    const {meta, title} = this.$seo({
      title: this.$i18n.t("meta.rules.title"),
      description: this.$i18n.t("meta.rules.description"),
      openGraph: {
        title: this.$i18n.t("meta.rules.title"),
        description: this.$i18n.t("meta.rules.description"),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath}
      }
    });
    return {meta, title};
  },
  components: {rulesTopSection, list},
  computed: {
    ...mapGetters("rules", {
      titles: "getData",
      rules: "getRule",
      total_pages: "getTotalPages",
      current_page: "getCurrentPage",
      load: "getLoad"
    }),
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  async created() {
    const listRules = await this.getRules({lang: this.lang});
    if (!listRules || !Array.isArray(listRules)) return;
    const linkFirstRule = listRules.sort((a, b) => a.sortNumber - b.sortNumber)[0];
    if (linkFirstRule && linkFirstRule.link) {
      this.$router.replace(this.localePath(`/rules/${linkFirstRule.link}/`));
    }
  },
  methods: {
    onChangeRule(link) {
      this.$router.push(this.localePath(`/rules/${link}/`));
    },
    ...mapActions("rules", {
      getRules: "getTitleRules",
      getRule: "getRule"
    })
  }
};
</script>
