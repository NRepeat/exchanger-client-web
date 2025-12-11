<template>
  <div>
    <rulesTopSection @onChangeRule="onChangeRule" />
    <div class="container">
      <div class="specification">
        <transition name="faded">
          <div v-if="load" class="specification-info">
            <h5 class="title">
              <b>{{ rules.title }}</b>
            </h5>
            <div style="white-space:pre-wrap" v-html="rules.content" />
          </div>
        </transition>
      </div>
    </div>
    <div class="reviews-bloc specification-news-bloc">
      <list :pagination="false" :limit="3" />
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import rulesTopSection from "~/components/rules/rulesTopSection";
import list from "~/components/news/list";

export default {
  components: {rulesTopSection, list},
  head() {
    if (!this.seo || !this.seo.title) {
      return null;
    }
    const {meta, title} = this.$seo({
      title: this.seo.title,
      description: this.seo.description,
      keywords: this.seo.keywords,
      openGraph: {
        title: this.seo.title,
        description: this.seo.description,
        content: this.seo.content,
        image: this.seo.image
      }
    });
    return {meta, title};
  },
  async asyncData({params, app, seo, error}) {
    const res = await app.$rest
      .api("GET:public/rule/get", {
        link: params.link,
        lang: app.i18n.locale
      })
      .catch(() => {
        error({ statusCode: 404, message: 'Post not found' })
        return null;
      });

    if (res && res.success && res.data) {
      let rule = res.data.rule;
      return {
        seo: {
          title: rule.seo && rule.seo.title ? rule.seo.title : rule.title,
          description: rule.seo && rule.seo.description ? rule.seo.description : rule.content.replace(/<\/?[^>]+>/ig, " "),
          keywords: rule.seo && rule.seo.keyword ? rule.seo.keyword : "",
          content: rule.content.replace(/<\/?[^>]+>/ig, " "),
          image: {url: app.$rest.fsPath + app.$rest.faviconPath},
        }
      }
    }
  },
  data() {
    return {
      link: null
    };
  },
  computed: {
    ...mapGetters({
      titles: "rules/getData",
      rules: "rules/getRule",
      total_pages: "rules/getTotalPages",
      current_page: "rules/getCurrentPage",
      load: "rules/getLoad"
    }),
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  watch: {
    // lang() {
    //   this.getRule({ link: this.$route.params.link, lang: this.lang }).then(
    //     r => {
    //       if (!r) this.$router.replace(this.localePath(`/rules/`));
    //     }
    //   );
    // }
  },
  created() {
    this.getRule({link: this.$route.params.link, lang: this.lang});
  },
  methods: {
    onChangeRule(link) {
      this.$router.push(this.localePath(`/rules/${link}/`));
    },
    ...mapActions({
      getRules: "rules/getTitleRules",
      getRule: "rules/getRule"
    })
  }
};
</script>
