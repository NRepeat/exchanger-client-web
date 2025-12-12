<template>
  <div class="popup popup-personal-room popup-open modal-mask">
    <div class="modal-wrapper">
      <div class="popup-close-bloc popup-close-bloc-personal-room" @click.self="$emit('close')" />
      <div class="popup-wr-item">
        <div class="modal-header">
          <h5 class="title text-center">
            {{ reset ? $t("modals.login.password_recovery") : $t("modals.login.login") }}
          </h5>
          <span class="popup-close-btn popup-close-btn-personal-room" @click.self="$emit('close')">
            &times;
          </span>
        </div>
        <transition name="faded">
          <div v-if="!reset && !auth && showComponent === 'login'" class="popup-top">
            <form action="">
              <div>
                <label>
                  <p
                    v-if="getRequestStateUser('login', 'isRejected')"
                    :style="{color: 'red', textAlign: 'center', fontWeight: 'bold'}"
                  >
                    {{ errStep }}
                  </p>
                  <p class="d-flex">
                    <span>{{ $t("modals.login.email") }}</span>
                    <a
                      @click="
                        showLog(false);
                        showReg(true);
                      "
                    >
                      {{ $t("ui.buttons.sign_up") }}
                    </a>
                  </p>
                  <p class="input-img">
                    <img src="~assets/img/mail.svg" alt="" />
                    <input
                      v-validate="'required|email'"
                      data-vv-scope="login"
                      v-model="formAuth.email"
                      :style="errors.has('login.email') ? {border: '1px solid red'} : {}"
                      :placeholder="$t('modals.login.email')"
                      name="email"
                      type="email"
                      @keyup.enter="$refs.password.focus()"
                    />
                  </p>
                </label>
              </div>

              <div>
                <label class="margin-b-0">
                  <p class="d-flex">
                    <span>{{ $t("modals.login.password") }}</span>
                    <a @click="reset = true">{{ $t("ui.buttons.forget") }}</a>
                  </p>
                  <p class="input-img">
                    <img src="~assets/img/cpasword.svg" alt="" />
                    <input
                      ref="password"
                      v-validate="'required|min:1'"
                      data-vv-scope="login"
                      v-model="formAuth.password"
                      :style="errors.has('login.password') ? {border: '1px solid red'} : {}"
                      name="password"
                      type="password"
                      placeholder="******"
                      @keyup.enter="
                        () => {
                          if (!captchaSettings.sitekey || !captchaSettings.module) return signin({formAuth});
                        }
                      "
                    />
                  </p>
                </label>
              </div>
              <div
                v-if="captchaSettings.sitekey && captchaSettings.module === 'recaptcha_v2'"
                style="transform: scale(0.9);margin-left: -15px;margin-bottom: 0;"
              >
                <recaptcha
                  ref="recaptcha"
                  :sitekey="captchaSettings.sitekey"
                  :load-recaptcha-script="true"
                  :language="$root.$i18n.locale"
                  @verify="token => (formAuth.captcha = token)"
                />
              </div>
              <div class="text-center">
                <button v-if="getRequestStateUser('login', 'isPending')" class="btn btn-submit" type="button">
                  <loader :responsive="true" width="44" height="44" />
                </button>
                <button v-else class="btn btn-submit" type="button" @click="signin({formAuth})">
                  <span>{{ $t("ui.buttons.sign_in") }}</span>
                </button>
              </div>
            </form>
          </div>

          <div v-if="reset && !auth" class="popup-top">
            <form action="">
              <div>
                <label class="popup-succes margin-b-0">
                  <span>{{ $t("modals.login.email") }}</span>
                  <p class="input-img">
                    <img src="~assets/img/mail.svg" alt="" />
                    <input v-model="email" type="email" placeholder="example@mail.com" />
                  </p>
                </label>
              </div>
              <div
                v-if="captchaSettings.sitekey && captchaSettings.module === 'recaptcha_v2'"
                style="transform: scale(0.9);margin-left: -15px;margin-bottom: 0;"
              >
                <recaptcha
                  ref="recaptcha"
                  :sitekey="captchaSettings.sitekey"
                  :load-recaptcha-script="true"
                  :language="$root.$i18n.locale"
                  @verify="token => (captcha = token)"
                />
              </div>

              <div class="text-center">
                <button class="btn btn-submit" @click.prevent="restPassword({email, captcha})">
                  {{ $t("ui.buttons.password_recovery") }}
                </button>
              </div>
            </form>
          </div>
        </transition>
        <div v-if="showComponent === '2fa'" class="popup-top">
          <p
            v-if="getRequestStateUser('login', 'isRejected')"
            :style="{color: 'red', textAlign: 'center', fontWeight: 'bold'}"
          >
            {{ errStep2 }}
          </p>
          <form action="">
            <div>
              <p class="d-flex flex-start"><img src="~assets/img/locked.svg" alt="" />{{ $t("modals.2fa.confirmCode") }}
              </p>
              <input
                ref="number"
                v-model="formAuth.code"
                autofocus
                class="hide"
                type="number"
                name="code"
                @keyup.enter="$emit('confirm', formAuth.code)"
                @input="
                  $event.target.value.length < 7
                    ? (formAuth.code = $event.target.value)
                    : (formAuth.code = $event.target.value.slice(0, 6))
                "
              />
              <div class="d-flex flex-row margin-b-0">
                <div
                  v-for="(val, i) in 6"
                  :key="i"
                  class="number"
                  :class="formAuth.code.length === i ? '' : ''"
                  @click="$refs.number.focus()"
                >
                  {{ formAuth.code.length === i ? "" : formAuth.code.charAt(i) }}
                  <span v-if="formAuth.code.length === i || (i === 5 && formAuth.code.length === 6)"
                        class="flick">|</span>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button class="btn btn-submit" @click.prevent="signin({step: '2fa', formAuth})">
                {{ $t("ui.buttons.sign_in") }}
              </button>
            </div>
          </form>
        </div>
        <div v-if="getRequestStateSocial('getSocials', 'isRejected')" class="popup-bottom d-flex">
          <p class="popup-bottom-title text-center">
            Error loading social methods
          </p>
        </div>
        <div v-else-if="getRequestStateSocial('getSocials', 'isPending')" class="popup-bottom d-flex">
          <p class="popup-bottom-title text-center">
            Loading social methods...
          </p>
        </div>
        <div
          v-else-if="!reset && !auth && getRequestStateSocial('getSocials', 'isSuccess') && socials.data.length > 0"
          class="popup-bottom d-flex"
        >
          <p class="popup-bottom-title text-center">
            {{ $t("modals.login.social") }}
          </p>
          <ul>
            <li v-for="(social, key) in socials.data" :key="'social_btn_' + key">
              <a :href="$rest.servicePath + social.url">
                <img v-if="social.name === 'google'" src="~assets/img/social/google-plus.svg" alt="" />
                <img v-if="social.name === 'facebook'" src="~assets/img/social/facebook.svg" alt="" />
                <img v-if="social.name === 'apple'" src="~assets/img/social/apple.svg" alt="" />
                <img v-if="social.name === 'twitter'" src="~assets/img/social/twitter.svg" alt="" />
                <img v-if="social.name === 'github'" src="~assets/img/social/github.svg" alt="" />
                <img v-if="social.name === 'linkedin'" src="~assets/img/social/linkedin.svg" alt="" />
                <img v-if="social.name === 'meetup'" src="~assets/img/social/meetup.svg" alt="" />
                <img v-if="social.name === 'instagram'" src="~assets/img/social/instagram.svg" alt="" />
                <img v-if="social.name === 'foursquare'" src="~assets/img/social/foursquare.svg" alt="" />
                <img v-if="social.name === 'amazon'" src="~assets/img/social/amazon.svg" alt="" />
                <img v-if="social.name === 'tumblr'" src="~assets/img/social/tumblr.svg" alt="" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  data() {
    return {
      reset: false,
      email: "",
      captcha: "",
      auth: false,
      valid: true,
      validCode: true,
      errStep: "",
      errStep2: "",
      message: "",
      showComponent: "login",

      formAuth: {
        email: "",
        password: "",
        captcha: "",
        code: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      captchaSettings: "params/getCaptchaConf",
      socials: "social/getSocials",
      getRequestStateSocial: "social/getRequestState",
      getRequestStateUser: "user/getRequestState",
      modalLoginType: "user/login",
    })
  },
  mounted() {
    return this.updateSocials();
  },
  methods: {
    ...mapActions({
      updateSocials: "social/updateSocials"
    }),
    ...mapActions({login: "user/login", restPasswordAPI: "user/restPassword"}),
    ...mapMutations({
      showLog: "user/login",
      showReg: "user/reg",
      changeStatusOpenKycModal: "user/changeStatusOpenKycModal"
    }),
    async restPassword(data) {
      await this.restPasswordAPI(data);
      if (this.getRequestStateUser("restPassword", "error").errorCode === 1601588666628861) {
        if (this.$refs.recaptcha && this.$refs.recaptcha.reset) this.$refs.recaptcha.reset();
      }
    },
    async signin(el) {
      if (!(await this.$validator.validateAll("login"))) return;
      if (el.step !== "2fa") {
        if (!el.formAuth.captcha && this.captchaSettings.sitekey && this.captchaSettings.module) {
          this.$swal("", this.$t("errorMessage.1601588666628861"), "error");
          return;
        }
      }

      let apiResult = await this.login(el.formAuth);
      if (this.getRequestStateUser("login", "error").errorCode === 1601588666628861) {
        if (this.$refs.recaptcha && this.$refs.recaptcha.reset) this.$refs.recaptcha.reset();
      }
      if (this.getRequestStateUser("login", "error").errorCode !== 6231533598118172) {
        this.errStep = this.getRequestStateUser("login", "error").message;
      }
      if (el.step === "2fa") {
        this.errStep2 = this.getRequestStateUser("login", "error").message;
      }
      if (this.getRequestStateUser("login", "error").errorCode === 6231533598118172) {
        this.errStep = undefined;
        if (this.showComponent === "2fa") {
          return (this.valid = false);
        }
        this.showComponent = "2fa";
        process.nextTick(() => {
          this.$refs.number.focus();
        });
        return;
      }
      if (apiResult) {
        this.$store.commit("user/setAuth", apiResult);
        this.errStep2 = undefined;
        return null;
      }
    }
  }
};
</script>
<style scoped>
/* todo transfer to scss */
.hide {
  position: absolute;
  top: -9999px;
}

.flick {
  font-size: 0px;
}

.hide:focus + .flex-row .flick {
  font-size: 18px;
  animation: flick 2s 0.2s infinite;
}

@keyframes flick {
  0% {
    /*color: auto;*/
  }
  50% {
    color: white;
  }
}

.number {
  width: 42px;
  height: 48px;
  border: 1px solid #eee;
  border-radius: 7px;
  font-size: 18px;
  top: 8px;
  position: relative;
  margin: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(250, 250, 250, 1);
}

.popup .title {
  margin: 0;
  padding: 0;
  font-size: 26px;
}

.popup form > div{
	margin: 0;
}

.popup-personal-date p {
  font-size: 12px;
  line-height: 1.2;
  font-weight: bold;
  margin-top: 20px;
}

.popup .btn {
  margin-top: 1rem;
  line-height: 2.75;
  font-size: 1rem;
  box-shadow: none;
}

.popup input,
.popup textarea {
  font-size: 13px;
  padding-bottom: 12px;
  padding-top: 12px;
}

.popup-bottom img {
  max-width: 30px;
}

.popup-wr-item {
  max-width: 300px;
  box-shadow: none;
  border-radius: 10px;
}

.input-img img {
  left: 1.25rem;
  width: 1rem;
}

.popup .d-flex a {
  text-decoration: none;
  text-align: right;
  color: #2563EB;
  font-size: 12px;
  font-weight: bold;
}

.popup-bottom-title {
  font-size: 15px;
  font-weight: bold;
}
</style>
