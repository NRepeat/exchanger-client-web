<template>
  <div class="pages">
    <div class=" right-bg form-index-top-wr">
      <div class="left-bg">
        <div class="form-index">
          <div class="container--form">
            <div style="padding:0 0 40px 0" v-if="webAlerts&&webAlerts.length">
              <template v-for="alert in webAlerts.filter(el => el.lang === $root.$i18n.locale && isNeedShowAlert(el))">
                <div :key="alert._id" class="notification-box" :class="alert.level" v-html="alert.content"/>
              </template>
            </div>
            <div class="title-text">
              <h1 class="text-center" v-html="$t('page.main.title')">
              </h1>
              <p class="text-center">{{ $t("page.main.descr") }}</p>
            </div>
            <div class="relative">
              <exchanger/>
              <client-only>
                <technicalWork v-if="getTechnicalWorkStatus" />
              </client-only>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="container">
      <stars/>
    </div>
    <reserves/>
    <div class="dn-mob">
      <news :limit="3" :pagination="false"/>
    </div>
    <reviews/>
    <div class="partner-block">
      <partner/>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import partner from "~/components/homepage/partner";
import news from "~/components/news/list";
import reviews from "~/components/homepage/reviews";
import reserves from "~/components/homepage/reserves";
import exchanger from "~/components/homepage/formindex";
import stars from "~/components/homepage/stars";
import technicalWork from "~/components/technical-work";

export default {
  components: {partner, news, reviews, reserves, exchanger, stars, technicalWork},
  computed: {
    ...mapGetters({info: "exchange/info", getTechnicalWorkStatus: "params/getTechnicalWorkStatus"}),
    ...mapGetters("notifications", ["webAlerts", "load"])
  },
  head() {
    const {meta, title} = this.$seo({
      name: this.$i18n.t("meta.main.title"),
      title: this.$i18n.t("meta.main.title"),
      description: this.$i18n.t("meta.main.description"),
      openGraph: {
        title: this.$i18n.t("meta.main.title"),
        description: this.$i18n.t("meta.main.description"),
        content: this.$i18n.t("meta.main.description"),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath}
      }
    })
    return {meta, title};
  },
  async asyncData({store}) {
    if (process.server) {
      // seo generate main page.
      await store.dispatch("exchange/routes")
    }
  },
  methods: {
    ...mapActions("notifications", ["getList"]),
    isNeedShowAlert({timeShowFrom, timeShowTo}) {
      const currTime = this.$moment().utc().format('HH:mm');
      if (timeShowFrom <= timeShowTo) {
        return currTime >= timeShowFrom && currTime <= timeShowTo;
      } else {
        if (currTime >= timeShowTo) {
          return currTime >= timeShowFrom;
        } else {
          return currTime <= timeShowTo;
        }
      }
    }
  },
  created() {
    this.getList({lang: this.$root.$i18n.locale});
    if (process.client && this.$route.query.ref) {
      console.log("Set new ref:", this.$route.query.ref)
      localStorage.setItem("partner", this.$route.query.ref);
    }
  }
};
</script>
<style lang="scss">
.relative{
  position: relative;
}
</style>