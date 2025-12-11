<template>
  <div class="transs-wr" v-if="!ieDetected">
    <div :style="reg || create || auth || login || reset ? {opacity: '0.1', background: '#fff'} : ''" class="transs">
      <headline />
      <div class="main-wr" @click="menuAllChange(false)">
        <div class="main">
          <nuxt />
        </div>
        <support v-if="!isStatusCode && showSupport" />
      </div>
      <footerBlock @click="menuAllChange(false)" />
    </div>
    <notify />
    <transition name="faded">
      <login v-if="login" @close="setLogin(false)" />
    </transition>
    <transition name="faded">
      <kyc-account v-if="isOpenKycModal" @close="changeStatusOpenKycModal(false)" />
    </transition>
    <transition name="faded">
      <reg v-if="reg" @close="setReg(false)" />
    </transition>
    <transition name="faded">
      <auth v-if="auth" @close="setAuth(false)" />
    </transition>
    <transition name="faded">
      <reset v-if="reset" @close="setReset(false)" />
    </transition>
    <transition name="faded">
      <qr v-if="create" @close="setCreate(false)" />
    </transition>
  </div>
  <div v-else class="ie_block">
    {{$t("page.main.ieDetected")}}
    <div >
      <img src="~/assets/img/chrome.svg"/>
      <a href="https://www.google.com/intl/ru/chrome/">Google Chrome</a>
    </div>
    <div >
      <img src="~/assets/img/firefox.svg"/>
      <a href="https://www.mozilla.org/ru/firefox/new/">Mozilla Firefox</a>
    </div>
    <div >
      <img src="~/assets/img/opera.svg"/>
      <a href="https://www.opera.com/ru">Opera</a>
    </div>
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
import VueJivosite from "@bchteam/vue-jivosite";
import KycAccount from "@/components/modals/kyc-account";

export default {
  head() {
    if (!this.$nuxtI18nHead) {
      return '';
    }
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  components: {
    KycAccount,
    headline,
    footerBlock,
    support,
    login,
    reg,
    notify,
    reset,
    auth,
    qr,
  },
  data() {
    return {
      trans: "",
      ieDetected: false
    };
  },
  computed: {
    ...mapGetters({
      isOpenKycModal: "user/isOpenKycModal",
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
  watch: {
    $route() {
      this.menuAllChange(false);
    }
  },
  async created() {

    // send locale for moment
    this.$moment.locale(this.$i18n.locale);
    this.$i18n.onLanguageSwitched = (oldLocale, newLocale) => {
      this.$moment.locale(newLocale);
    };
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
    if (process.server) {
      return null; //no-ssr
    }
    this.$rest.api("POST:public/visits/register", {
      refUrl: window.document.referrer
    });
    let userAgent = window.navigator.userAgent;
    let msie = userAgent.indexOf("MSIE ");

    if (msie > 0) {
      this.ieDetected = true;
    }
    if (process.client) {
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

  },
  methods: {
    ...mapActions({
      updateSettings: "params/updateSettings",
      authSocket: "user/authSocket",
      checkAuth: "user/checkAuth"
    }),
    ...mapMutations({
      changeStatusOpenKycModal: "user/changeStatusOpenKycModal",
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
<style scoped>
.ie_block {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111;
  flex-direction: column;
  font-size: 25px;
  background:#AAA;
  border-radius: 20px;
  width:50%;
  margin:0 auto;
  text-align: center;
  padding: 15px;
}
.ie_block>div {
  font-weight: bold;
  margin-top: 20px;
  color:#333;
  display: flex;
}
.ie_block  a:hover {
  color: #00aabb;
}
.ie_block img{
  width:30px;
  height:30px;
  margin-right:15px;
}
</style>

