<template>
  <div class="news-bloc">
    <h3 class="title">
      {{ $t("page.news.title") }}
      <nuxt-link :to="localePath('/news/')" class="btn btn-look">{{ $t("page.user.news.all") }}</nuxt-link>
    </h3>
    <ul>
      <li v-for="news in sliceInfo" :key="news._id">
        <div class="news-bloc-img">
          <nuxt-link v-if="news.image" :to="localePath(`/news/${news.link}/`)" href="/one-new.html">
            <img :src="$rest.urlImg(news.image).medium" alt=""/>
          </nuxt-link>
        </div>
        <div class="news-bloc-info">
          <span>{{ $t("page.news.category") }}</span>
          <p class="news-bloc-title">{{ page.news.title }}</p>

          <div class="news-bloc-info_item">
            <div>
              <div class="news-bloc-info_item-photo-name">
                <div class="news-bloc-info_item-photo">
                  <img src="~assets/img/user-main.svg" alt=""/>
                </div>

                <div class="news-bloc-info_item-name">
                  <p>{{ news.author && news.author.name ? news.author.name : "Admin"}}</p>
                  <span>{{ $moment(news.updatedAt).format("DD MMM YYYY | HH:mm") }}</span>
                </div>
              </div>
            </div>

            <div class="news-bloc-info_item-data">
              <span>
                <img src="~assets/img/visible.svg" alt=""/> <span>{{ news.views }}</span>
              </span>
            </div>

          </div>


        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters({
      news: "news/getData"
    }),
    sliceInfo() {
      return this.news.slice(0, 3);
    }
  },
  created() {
    this.getNewsFull();
  },
  methods: {
    ...mapActions({
      getNewsFull: "news/getNewsFull"
    })
  }
};
</script>
