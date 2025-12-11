<template>
  <div class="popup popup-personal-room popup-open modal-mask">
    <div class="modal-wrapper">
      <div class="popup-close-bloc popup-close-bloc-personal-room" @click.self="$emit('close')" />
      <div class="popup-wr-item">
        <div class="modal-header text-center">
          <span v-if="load && qr" class="popup-close-btn popup-close-btn-personal-room" @click.self="$emit('close')">
            &times;
          </span>
        </div>
        <transition name="faded-down">
          <div v-if="qr" class="qr-block">
            <p class="qr-block-title">
              {{ $t("modals.2fa.scan") }}
            </p>
            <qrcode-vue v-if="qr.url" :value="qr.url" :size="180" level="H" class-name="qrcode-image" />
            <img v-else :src="qr.image" width="200" height="200" />
            <p class="small-text">
              {{ $t("modals.2fa.copy") }}
            </p>

            <div class="border-shadow p-input-secter">
              <p v-if="copied" class="copied-text-2fa">
                {{ $t("modals.2fa.copied") }}
                <span class="copy-icon-profile">
                  <span>
                    <img src="~assets/img/copy-documents-option.svg" alt="copy-documents" style="opacity: 0" />
                  </span>
                </span>
              </p>
              <p v-else>
                {{ qr.secret }}
                <span class="copy-icon-profile" @click="clip">
                  <span>
                    <img src="~assets/img/copy-documents-option.svg" alt="copy-documents" />
                  </span>
                </span>
              </p>
            </div>
            <p class="small-text helper-token-text">
              {{ $t("modals.2fa.write") }}
            </p>
            <input
              ref="number"
              v-model="code"
              autofocus
              class="hide"
              type="number"
              name="code"
              :placeholder="$t('writeCode')"
              @keyup.enter="otpConfirm(code).then(r => (r ? setCreate(false) : ''))"
              @input="
                $event.target.value.length < 7 ? (code = $event.target.value) : (code = $event.target.value.slice(0, 6))
              "
            />

            <div class="number-wr">
              <div
                v-for="(val, i) in 6"
                :key="i"
                class="number"
                :class="code.length === i ? '' : ''"
                @click="$refs.number.focus()"
              >
                {{ code.length === i ? "" : code.charAt(i) }}
                <span v-if="code.length === i || (i === 5 && code.length === 6)" class="flick">|</span>
              </div>
            </div>
            <button class="btn btn-submit" @click="otpConfirm(code).then(r => (r ? setCreate(false) : ''))">
              {{ $t("modals.2fa.confirm") }}
            </button>
            <p class="small-text app-links-block">{{ $t("modals.2fa.app") }} Google Authenticator</p>
            <div class="mobile-bar">
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://itunes.apple.com/us/app/google-authenticator/id388497605В"
              >
                <img src="~assets/img/apple-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              >
                <img src="~assets/img/android-brands.svg" alt="firefox 2fa app" />
              </a>

              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://www.microsoft.com/en-us/p/authenticator/9nblggh08h54"
              >
                <img src="~assets/img/windows-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai"
              >
                <img src="~assets/img/chrome-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://addons.mozilla.org/en-US/firefox/addon/auth-helper/?src=search"
              >
                <img src="~assets/img/firefox-brands.svg" alt="firefox 2fa app" />
              </a>
            </div>
          </div>
          <div v-else class="qr-block">
            <p v-if="load" class="qr-block-title">
              {{ $t("modals.2fa.scan") }}
            </p>
            <loader v-else :responsive="true" width="100" height="100" />
            <p class="small-text app-links-block">{{ $t("modals.2fa.app") }} Google Authenticator</p>
            <div class="mobile-bar">
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://itunes.apple.com/us/app/google-authenticator/id388497605В"
              >
                <img src="~assets/img/apple-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              >
                <img src="~assets/img/android-brands.svg" alt="firefox 2fa app" />
              </a>

              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://www.microsoft.com/en-us/p/authenticator/9nblggh08h54"
              >
                <img src="~assets/img/windows-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai"
              >
                <img src="~assets/img/chrome-brands.svg" alt="firefox 2fa app" />
              </a>
              <a
                class="small-text mobile app-link"
                target="_blank"
                href="https://addons.mozilla.org/en-US/firefox/addon/auth-helper/?src=search"
              >
                <img src="~assets/img/firefox-brands.svg" alt="firefox 2fa app" />
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

export default {
  data() {
    return {
      copied: false,
      code: "",
      secret: ""
    };
  },
  computed: {
    ...mapGetters("user", ["qr", "load"])
  },
  watch: {
    qr() {
      this.code = "";
    }
  },
  created() {
    this.otpCreate();
  },
  methods: {
    clip() {
      navigator.clipboard.writeText(this.qr.secret);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
    ...mapActions("user", ["otpCreate", "otpConfirm"]),
    ...mapMutations("user", {setCreate: "create"})
  }
};
</script>

<style scoped>
@import "./index.scss";
</style>
