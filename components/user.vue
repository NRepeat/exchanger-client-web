<template>
  <div class="user-page">
    <div class="profile-top-wr">
      <div class="container">
        <!--        <h1>{{ $t("page.user.nav.profile") }}</h1>-->
        <div class="profile-nav">
          <ul>
            <li>
              <nuxt-link
                :to="localePath(`/user/profile/`)"
                active-class="profile-nav-active"
              >{{ $t("ui.buttons.profile") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath(`/user/requisites/`)" active-class="profile-nav-active">
                {{ $t('ui.buttons.requisites') }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath(`/user/partner-system/`)"
                active-class="profile-nav-active"
              >
                {{ $t("ui.buttons.affiliate") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath(`/user/orders/`)"
                active-class="profile-nav-active"
              >
                {{ $t("ui.buttons.requests") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath(`/user/api/`)" active-class="profile-nav-active">
                {{ $t("ui.buttons.api") }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  created() {
    if(process.server) return;
    this.checkAuth();
    this.timeout = setInterval(this.checkAuth, 60000*15); // every 15min
  },
  beforeDestroy() {
    clearInterval(this.timeout);
  },
  methods: {
    ...mapActions({
      checkAuthAPI: "user/checkAuth"
    }),
    async checkAuth() {
      if(process.server) return;
      const session = await this.checkAuthAPI();
      if (session === 403) {
        console.log("[Unauthorized] Redirect to home page components/user.vue/checkAuth");
        return this.$router.replace(this.localePath("/"));
      }
    }
  },
  head() {
    return {
      title: this.$rest.projectName + " - " + this.$t("meta.user.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.user.description")
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.$t("meta.user.keywords")
        }
      ]
    };
  }
};
</script>
