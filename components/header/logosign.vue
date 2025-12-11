<template>
  <div  @click.stop>

      <transition v-if="!hideBtnLogin" name="faded">
        <div v-if="!info || !info.email" class="registration">
          <ul>
            <li>
              <button class="btn-round btn-round-transparent" @click="setLogin(true)">
                {{ $t("ui.header.sign") }}
              </button>
            </li>
            <li>
              <button class="btn-round btn-round-blue" @click="setReg(true)">
                {{ $t("ui.header.reg") }}
              </button>
            </li>
          </ul>
        </div>

        <div v-else class="user-bloc">
          <div class="user-bloc-date" @click="change(!user)">
            <div v-if="info && info.first_name && info.last_name"  class="user-bloc-date-photo">
<!--              <div class="user-bloc-date-photo-item">-->
<!--                <img src="~/assets/img/user.svg" alt="" />-->
                {{info.first_name.toUpperCase().charAt(0)}}
                {{info.last_name.toUpperCase().charAt(0)}}

<!--              </div>-->
            </div>
            <div class="user-bloc-date-info">
              <p>{{ info.first_name }} {{ info.last_name }}</p>
              <span>{{ info.email }}</span>
            </div>
<!--            <em class="caret" />-->
          </div>

          <ul :class="{'user-bloc-list-open': user}" class="user-bloc-list">
            <li>
              <nuxt-link :to="localePath('/user/profile/')">
                <img src="~/assets/img/user.svg" alt="" />
                {{ $t("ui.header.profile") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath('/user/orders/')">
                <img src="~/assets/img/edit.svg" alt="" />
                {{ $t("ui.header.requests") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath('/user/partner-system/')">
                <img src="~/assets/img/hand-shake.svg" alt="" />
                {{ $t("ui.header.affiliate") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="localePath('/user/api/')">
                <img src="~/assets/img/documents.svg" alt="" />
                {{ $t("ui.header.api") }}
              </nuxt-link>
            </li>
            <li>
              <a @click="destroyAuth().then(() => change(false))">
                <img src="~/assets/img/logout.svg" alt="" />
                {{ $t("ui.header.exit") }}
              </a>
            </li>
          </ul>
        </div>
      </transition>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  props: {
    hideBtnLogin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("menu", ["user"]),
    ...mapGetters("user", ["info"])
  },
  methods: {
    ...mapMutations("menu", {change: "user"}),
    ...mapMutations("user", {setLogin: "login", setReg: "reg"}),
    ...mapActions({
      destroyAuthAPI: "user/destroyAuth",
      checkAuth: "user/checkAuth",
    }),
    async destroyAuth() {
      await this.destroyAuthAPI().catch(() => null);
      if (this.$route.path.indexOf("/user/") !== -1) {
        console.log("[Unauthorized] Redirect to home page *logosign.vue*", this.$route.path);
        return await this.$router.replace(this.localePath("/"));
      }
      return true;
    }
  }
};
</script>
