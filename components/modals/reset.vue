<template>
  <div class="popup popup-personal-room popup-open">
    <div class="popup-close-bloc popup-close-bloc-personal-room" @click.self="$emit('close')" />
    <div class="popup-wr">
      <span class="popup-close-btn popup-close-btn-personal-room" @click.self="$emit('close')">
        &times;
      </span>
      <div class="popup-wr-item">
        <h5 class="title text-center">{{ $t("page.user.profile.reset.title") }}</h5>
        <div class="popup-top">
          <form action="">
            <div>
              <label>
                <span>{{ $t("page.user.profile.reset.password") }}</span>
                <p class="input-img">
                  <img src="~assets/img/cpasword.svg" alt="" />
                  <input v-model="pass.password" type="password" placeholder="******" />
                </p>
              </label>

              <label class="popup-succes margin-b-0">
                <span>{{ $t("page.user.profile.reset.repeat") }}</span>
                <p class="input-img">
                  <img src="~assets/img/cpasword.svg" alt="" />
                  <input v-model="pass.repeat" type="password" placeholder="******" />
                </p>
              </label>
            </div>

            <div :style="{opacity: load ? 1 : 0.5}" class="text-center">
              <button
                class="btn btn-submit"
                @click.prevent="
                  pass.password === pass.repeat
                    ? resetPassword(pass).then(res => (res ? reset(false) : ''))
                    : $store.dispatch('notify/add', {type: 'warning', message: 'Repeat your password incorrect'})
                "
              >
                <!-- todo:long fn please move to scrip ^^  -->
                {{ $t("page.user.profile.reset.submit") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

export default {
  data() {
    return {
      pass: {
        password: "",
        token: this.$route.params.token,
        repeat: ""
      }
    };
  },
  computed: {
    ...mapGetters("user", ["load"])
  },
  methods: {
    ...mapActions("user", ["resetPassword"]),
    ...mapMutations("user", ["login", "reset"])
  }
};
</script>
