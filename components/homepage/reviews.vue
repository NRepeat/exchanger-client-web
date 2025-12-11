<template>
  <div class="reviews-bloc">
    <div class="container">
      <h3 class="title-other">
        {{ $t("page.main.reviews.title") }}
        <nuxt-link :to="localePath('/reviews/')" class="btn btn-look">
          {{ $t("page.main.reviews.all") }}
        </nuxt-link>
      </h3>
      <ul>
        <li v-for="reviewItem in reviewsArray" :key="reviewItem._id">
          <div class="reviews-bloc-txt">
            <p class="reviews-bloc__">{{ reviewItem.message }}</p>
            <p class="reviews-bloc-date">{{ $moment(reviewItem.createdAt).format("DD MMM YYYY - HH:mm") }}</p>

          </div>

          <div class="reviews-bloc-client">

            <div class="reviews-bloc-photo">
              <img src="~/assets/img/user-main.svg" alt="" />
            </div>

            <div>
              <p>
                {{ reviewItem.name || "Anonymous" }}
              </p>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data() {
    return {reviews: []};
  },
  computed: {
    reviewsArray() {
      return this.reviews.slice(0, 3);
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
    async updateList() {
      const result = await this.updateListReviews({lang: this.lang});
      if (result) {
        this.reviews = result.reviews;
      }
    }
  }
};
</script>
