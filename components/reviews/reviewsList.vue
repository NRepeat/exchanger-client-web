<template>
  <div>
    <div v-if="reviewsArray.length > 0">
      <ul :style="{opacity: getRequestStateReviews('getReviews', 'isSuccess') ? 1 : 0.5}" class="reviews-main-list">
        <li
          v-for="reviewItem in reviewsArray"
          :key="reviewItem._id"
          :style="
            reviewItem.message && getRequestStateReviews('getReviews', 'isSuccess')
              ? {}
              : {background: '#CCC', minHeight: '123px', borderRadius: '5px'}
          "
        >
          <div
            v-if="reviewItem.message && getRequestStateReviews('getReviews', 'isSuccess')"
            class="reviews-main-list-item"
          >
            <div class="reviews-main-list-person">
              <div class="reviews-main-list-person-photo">
                <img src="~assets/img/user-main.svg" alt="" />
              </div>
              <div class="reviews-main-list-person-name">
                <p :style="{background: reviewItem.message ? '' : '#eee'}">
                  <b>{{ reviewItem.name || "Anonymous" }}</b>
                </p>
                <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
              </div>
            </div>
            <div class="reviews-main-list-txt">
              <span :style="{background: reviewItem.message ? '' : '#eee'}">
                {{ $moment(reviewItem.createdAt).format("DD MMM YYYY") }}
              </span>
              <p :style="{background: reviewItem.message ? '' : '#eee'}">
                {{ reviewItem.message }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <pagination
        :current-page="current_page"
        :total-pages="total_pages"
        @page-changed="updateList($event)"
      />
    </div>
    <div v-else class="text-center">
      {{ $t("page.reviews.reviews_not_found") }}
    </div>
  </div>
</template>

<script>
import pagination from "~/components/pagination";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {pagination},
  data() {
    return {reviews: [], current_page: 1, total_pages: 1, page: 1, limit: 10};
  },
  computed: {
    ...mapGetters({
      getRequestStateReviews: "reviews/getRequestState"
    }),
    reviewsArray() {
      return this.reviews;
    },
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  watch: {
    lang() {
      this.updateList();
    }
  },
  async created() {
    await this.updateList();
  },
  methods: {
    ...mapActions({
      updateListReviews: "reviews/updateListReviews"
    }),
    async updateList(page, limit) {
      if (page) {
        this.page = page;
      }
      if (limit) {
        this.limit = limit;
      }

      const result = await this.updateListReviews({lang: this.lang, page: this.page, limit: this.limit});
      if (result) {
        this.reviews = result.reviews;
        this.current_page = result.select_page;
        this.total_pages = result.total_pages;
      }
    }
  }
};
</script>
