<template>
  <form action="" class="form form_reviews-new">
    <div class="form_reviews-new_wr">
      <h4 class="title text-center">{{ $t("page.reviews.form_send") }}</h4>
      <div class="form_reviews-new_base">
        <p>
          <input
            v-model="rev.authorName"
            v-validate="'required|min:2|max:20'"
            data-vv-scope="review"
            :style="errors.has('review.author_name') ? {border: '1px solid red'} : {}"
            name="author_name"
            autocomplete="off"
            :placeholder="$t('page.reviews.your_name')"
            type="text"
          />
        </p>
        <p>
          <input
            v-model="rev.email"
            v-validate="'required|email'"
            data-vv-scope="review"
            :style="errors.has('review.email') ? {border: '1px solid red'} : {}"
            name="email"
            :placeholder="$t('page.reviews.your_email')"
            type="email"
          />
        </p>
        <p>
          <textarea
            v-validate="'required|min:6|max:1000'"
            data-vv-scope="review"
            :style="errors.has('review.message') ? {border: '1px solid red'} : {}"
            name="message"
            v-model="rev.message"
            :placeholder="$t('page.reviews.msg_text')"
            cols="30"
            rows="10"
          />
        </p>
        <div class="text-center">
          <button class="btn btn-submit" @click.prevent="sendReview">
            {{ $t("ui.buttons.send_reviews_form") }}
          </button>
        </div>
      </div>
    </div>
    <div class="form-ruls">
      <p class="text-center">
        {{ $t("page.reviews.agree") }}
        <nuxt-link :to="localePath('/rules/')">{{ $t("page.reviews.agree_rules") }}</nuxt-link>
        {{ "." }}
      </p>
    </div>
  </form>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data() {
    return {
      rev: {
        email: "",
        message: "",
        authorName: "",
        lang: this.$root.$i18n.locale
      }
    };
  },
  computed: {
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  watch: {
    lang() {
      this.rev.lang = this.lang;
    }
  },
  methods: {
    ...mapActions({
      getReviews: "reviews/getReviews",
      createReview: "reviews/createReview"
    }),
    async sendReview() {
      if (!(await this.$validator.validateAll("review"))) {
        return;
      }
      await this.createReview(this.rev);
      await this.getReviews({lang: this.lang});
      this.rev.email = "";
      this.rev.message = "";
      this.rev.authorName = "";
      process.nextTick(() => this.$validator.errors.clear());

      return "ok";
    }
  }
};
</script>
