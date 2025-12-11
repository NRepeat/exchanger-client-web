<template>
  <div class="transs-wr">
    <div class="transs">
      <!--      <headline />-->
<!--      <div>-->
      <div @click="menuAllChange(false)">
        <nuxt />
      </div>
<!--      </div>-->
    </div>
    <notify />
  </div>
</template>

<script>
import Vue from "vue";
import headline from "~/components/header";
import footerBlock from "~/components/footer/footer";
import support from "~/components/footer/support";
import {mapActions, mapGetters, mapMutations} from "vuex";
import login from "~/components/modals/login";
import reg from "~/components/modals/reg";
import qr from "~/components/modals/modal/index";
import auth from "~/components/modals/auth";
import reset from "~/components/modals/reset";
import notify from "~/components/notify";
import technicalWork from "~/components/technical-work";
import VueJivosite from "@bchteam/vue-jivosite";

export default {
  components: {
    headline,
    footerBlock,
    support,
    login,
    reg,
    notify,
    reset,
    auth,
    qr,
    technicalWork
  },
  data() {
    return {
      trans: ""
    };
  },
  computed: {
    ...mapGetters({
      getJivoSite: "params/getJivoSite",
      getTechnicalWorkStatus: "params/getTechnicalWorkStatus",
      notifies: "notify/notifies",
      timeout: "notify/timeout",
      backup: "notify/backup",
      menu: "menu/menu",
      user: "menu/user",
      login: "user/login",
      reg: "user/reg",
      reset: "user/reset",
      auth: "user/auth",
      create: "user/create"
    }),
    isTechicalWorkShow() {
      return this.getTechnicalWorkStatus && this.$route.path.length <= 4; // example: /en/ (lenght = 4 )
    },
    showSupport() {
      return !["/error/", "/success/", "/reset-password", "/contacts"].some(
        el => this.$route.path.match(el) || !this.$route.name
      );
    },
    isStatusCode() {
      if (!this.$nuxt.nuxt.err) return false;
      return this.$nuxt.nuxt.err.statusCode === 404 || this.$nuxt.nuxt.err.statusCode === 500;
    }
  },
  async created() {
    if (process.client) {
      // send locale for moment
      this.$moment.locale(this.$i18n.locale);
      this.$i18n.onLanguageSwitched = (oldLocale, newLocale) => {
        this.$moment.locale(newLocale);
      };
      const allowLocales = this.$i18n.locales.map(el => el.code);
      const urlLang = this.$route.path
        .slice(0, 4)
        .replace("/", "")
        .replace("/", "");

      let readyLang = Boolean(this.$cookiz.get("i18n_redirected"));
      // if (allowLocales.indexOf(urlLang) !== -1) {
      //   this.$cookiz.set("i18n_redirected", String(urlLang));
      //   readyLang = true;
      // }
      // if (!readyLang) {
      //   const lang = navigator.language.toLocaleLowerCase().substring(0, 2);
      //   if (allowLocales.indexOf(lang) !== -1) {
      //     this.$cookiz.set("i18n_redirected", String(lang));
      //     this.$router.push(this.switchLocalePath(lang));
      //   }
      // }
    }

    if (this.$rest.ws.readyState === 1) {
      this.authSocket();
    }
    this.$events.on("ws/connect", () => {
      this.authSocket();
    });

    this.$events.on("ws/emit/updateStatusWorkSite", data => {
      this.$store.commit("params/setWorkStatus", data.offlineStatus);
    });
    await this.updateSettings();
    await this.checkAuth();
    if (process.server) {
      return null; //no-ssr
    }
    if (this.getJivoSite) {
      Vue.use(VueJivosite, {widgetId: this.getJivoSite});
    }
  },
  mounted() {
    this.menuAllChange(false);
    //register
    if (process.server) {
      return null; //no-ssr
    }
    this.$rest.api("POST:public/visits/register", {
      refUrl: window.document.referrer
    });
  },
  methods: {
    ...mapActions({
      updateSettings: "params/updateSettings",
      authSocket: "user/authSocket",
      checkAuth: "user/checkAuth"
    }),
    ...mapMutations({
      menuAllChange: "menu/all",
      setLogin: "user/login",
      setReg: "user/reg",
      setReset: "user/reset",
      setAuth: "user/auth",
      setCreate: "user/create"
    })
  }
};
</script>
