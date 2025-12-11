<template>
  <div class="popup popup-registration popup-open modal-mask">
    <div class="modal-wrapper">
      <div class="popup-close-bloc" @click.self="$emit('close')" />
      <div class="popup-wr-item">
        <div class="modal-header text-center">
          <h5 class="title text-center">
            {{ $t("modals.sign_up.sign_up") }}
          </h5>
          <span class="popup-close-btn" @click.self="$emit('close')">&times;</span>
        </div>
        <div class="popup-top">
          <form action="#">
            <p
              v-if="getRequestStateUser('registration', 'isRejected')"
              :style="{color: 'red', textAlign: 'center', fontWeight: 'bold'}"
            >
              {{ getRequestStateUser("registration", "error").message }}
            </p>
            <div class="d-flex d-email">
              <label>
                <span>{{ $t("modals.sign_up.email") }}</span>
                <p class="input-img">
                  <img src="~assets/img/mail.svg" alt="" />
                  <input
                    v-validate="'required|email'"
                    data-vv-scope="register"
                    v-model="newProfileForm.email"
                    :style="errors.has('register.email') ? {border: '1px solid red'} : {}"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    @focus="message = ''"
                  />
                </p>
              </label>
            </div>
            <div class="d-flex d-flex__col">
              <div>
                <label>
                  <span>{{ $t("modals.sign_up.name") }}</span>
                  <p class="input-img">
                    <img src="~assets/img/user.svg" alt="" />
                    <input
                      v-validate="'required|alpha_spaces|min:2|max:50'"
                      data-vv-scope="register"
                      v-model="newProfileForm.first_name"
                      :placeholder="$t('modals.sign_up.your_name')"
                      :style="errors.has('register.first_name') ? {border: '1px solid red'} : {}"
                      name="first_name"
                      type="text"
                      @focus="message = ''"
                    />
                  </p>
                </label>
              </div>
              <div>
                <label>
                  <span>{{ $t("modals.sign_up.surname") }}</span>
                  <p class="input-img">
                    <img src="~assets/img/user.svg" alt="" />
                    <input
                      v-validate="'required|alpha_spaces|min:2|max:50'"
                      data-vv-scope="register"
                      v-model="newProfileForm.last_name"
                      :placeholder="$t('modals.sign_up.your_surname')"
                      :style="errors.has('register.last_name') ? {border: '1px solid red'} : {}"
                      name="last_name"
                      type="text"
                      @focus="message = ''"
                    />
                  </p>
                </label>
              </div>
            </div>
            <div class="d-flex d-flex__col">
              <div>
                <label>
                  <span>{{ $t("modals.sign_up.password") }}</span>
                  <p class="input-img">
                    <img src="~assets/img/cpasword.svg" alt="" />
                    <input
                      ref="password"
                      v-validate="'required|min:6'"
                      data-vv-scope="register"
                      v-model="newProfileForm.password"
                      :style="errors.has('register.password') ? {border: '1px solid red'} : {}"
                      name="password"
                      type="password"
                      placeholder="******"
                      @focus="message = ''"
                    />
                  </p>
                </label>
              </div>
              <div>
                <label>
                  <span>{{ $t("modals.sign_up.repeat") }}</span>
                  <p class="input-img">
                    <img src="~assets/img/cpasword.svg" alt="" />
                    <input
                      v-validate="'required|confirmed:password'"
                      data-vv-as="password"
                      data-vv-scope="register"
                      :style="errors.has('register.password_confirmation') ? {border: '1px solid red'} : {}"
                      v-model="repeatPassword"
                      type="password"
                      name="password_confirmation"
                      placeholder="******"
                      @focus="message = ''"
                    />
                  </p>
                </label>
              </div>
            </div>
            <div
              v-if="captchaSettings.sitekey && captchaSettings.module === 'recaptcha_v2'"
              style="text-align: center;width: 100%"
            >
              <center>
                <recaptcha
                  ref="recaptcha"
                  :sitekey="captchaSettings.sitekey"
                  :load-recaptcha-script="true"
                  :language="$root.$i18n.locale"
                  @verify="token => (newProfileForm.captcha = token)"
                />
              </center>
            </div>
            <div class="d-flex popup-personal-room__bot">
              <div class="popup-personal-date">
                <p>{{ $t("modals.sign_up.rules") }}</p>
              </div>

              <div class="text-center">
                <button v-if="getRequestStateUser('registration', 'isPending')" class="btn btn-submit" type="button">
                  <loader :responsive="true" width="44" height="44" />
                </button>
                <button v-else type="button" class="btn btn-submit" @click.prevent="registration">
                  <span>{{ $t("ui.buttons.sign_up") }}</span>
                </button>
              </div>
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
          v-if="getRequestStateSocial('getSocials', 'isSuccess') && socials.data.length > 0"
          class="popup-bottom d-flex popup-bottom__"
        >
          <p class="d-flex popup-bottom-title">
            <img src="~assets/img/user-popup.svg" alt="" />
            {{ $t("modals.sign_up.social") }}
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
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      message: "",
      repeatPassword: "",

      newProfileForm: {
        first_name: "",
        last_name: "",
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
      getRequestStateUser: "user/getRequestState"
    })
  },
  mounted() {
    return this.updateSocials();
  },
  methods: {
    ...mapActions({
      updateSocials: "social/updateSocials",
      createUser: "user/reg"
    }),
    async registration() {
      if (!(await this.$validator.validateAll("register"))) return;
      if (!this.newProfileForm.captcha && this.captchaSettings.sitekey && this.captchaSettings.module) {
        this.$swal("", this.$t("errorMessage.1601588666628861"), "error");
        return;
      }
      await this.createUser({
        ...this.newProfileForm,
        return_to: this.$rest.baseUrl + this.localePath('/') + '{status}/confirm/account/'
      });
      if (this.getRequestStateUser("registration", "error").errorCode === 1601588666628861) {
        if (this.$refs.recaptcha && this.$refs.recaptcha.reset) this.$refs.recaptcha.reset();
      }
    }
  }
};
</script>
<style scoped>
/* todo transfer to scss */
.popup .title {
  margin: 0;
  padding: 0;
  font-size: 32px;
}

.popup-personal-room__bot{
	padding-top: 20px;
	align-items: center;
}

.popup-personal-date p {
  font-size: 11px;
  line-height: 1.2;
  font-weight: bold;
  //margin-top: 20px;
}

/* .popup .btn {
  margin-top: 1rem;
  line-height: 2.75;
  font-size: 1rem;
  box-shadow: none;
} */

.popup input,
.popup textarea {
  margin-top: 10px;
  font-size: 13px;
  padding-bottom: 12px;
  padding-top: 12px;
}

.popup-bottom img {
  max-width: 30px;
  width: 100%;
}

.popup .d-flex {
  justify-content: flex-start;
}

.popup .d-flex__col {
  justify-content: space-between;
}

.popup-wr-item {
  box-shadow: none;
  /*width: 100%;*/
  max-width: 550px;
  /*box-shadow: none;*/
  border-radius: 10px;
}

.input-img img {
  position: absolute;
  left: 1.25rem;
  width: 1.1rem;
  margin: 0;
  top: 22px;
}
</style>
