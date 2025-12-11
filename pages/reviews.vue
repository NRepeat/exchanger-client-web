<template>
  <div>
    <div class="container">

      <h1>{{ $t("page.reviews.title") }}</h1>
      <div class="reviews-top">
        <ul>
          <li v-for="(item, key) in activeReviews" :key="key">
            <a :href="item.linkReview" target="_blank" class="btn btn-blue">
              {{ $t("page.reviews.feedbackOn") }}
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <transition name="faded">
      <loader v-if="getRequestStateReviews('getReviews', 'isPending')" />
    </transition>
    <div class="reviews">
      <div class="container">
        <no-ssr>
          <reviewsList class="reviews-main" />
        </no-ssr>
        <reviewsForm />
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import pagination from "~/components/pagination";
import reviewsForm from "~/components/reviews/reviewsForm";
import reviewsList from "~/components/reviews/reviewsList";

export default {
  head() {
    const {meta, title} = this.$seo({
      title: this.$i18n.t("meta.reviews.title"),
      description: this.$i18n.t("meta.reviews.description"),
      openGraph: {
        title: this.$i18n.t("meta.reviews.title"),
        description: this.$i18n.t("meta.reviews.description"),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath}
      }
    });
    return {meta, title};
  },
  components: {reviewsForm, reviewsList, pagination},
  computed: {
    ...mapGetters({
      activeReviews: "partners/activeReviews",
      getRequestStateReviews: "reviews/getRequestState"
    }),
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  created() {
    this.getPartners({onlyReviewPartners: true});
  },
  methods: {
    ...mapActions({
      getPartners: "partners/getPartners"
    })
  }
};
</script>
