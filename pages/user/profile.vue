<template>
  <div v-if="info" class="container">
    <auth2fa
      v-if="initOtpDelete"
      @close="initOtpDelete = false"
      @confirm="otpDelete"
    />
    <div class="text-center">
      <h1>{{ $t("page.user.nav.profile") }}</h1>
    </div>
    <div class="profile__main">
      <user/>
      <ul>
        <li>
          <div class="profile__main--item profile__main--item__file">
            <p class="profile__main--title text-center">
              <!--              <img src="~assets/img/avatar.svg" alt="" />-->
              {{ $t("page.user.profile.contact") }}
            </p>
            <div class="profile__file">
              <!--              <div class="profile__file__border">-->
              <img src="~assets/img/avatar.svg" alt=""/>
              <p v-if="false" class="text-center">
                {{ $t("page.user.profile.edit") }}
              </p>
              <!--              </div>-->
            </div>
            <div  class="profile__buttons">
              <nuxt-link
                v-if="!profile.verificationPerson"
                style="margin: 20px auto;"
                class="btn btn-submit"
                :to="localePath('/user/verification')"
              >
                <span>Start verification process</span>
              </nuxt-link>
            </div>



            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.first_name") }}</span>
                <div class="form__input ">
                  <div>
                    <input
                      v-validate="'required|alpha_spaces|min:2|max:50'"
                      data-vv-scope="mainProfile"
                      v-model="profile.first_name"
                      :style="errors.has('mainProfile.first_name') ? {border: '1px solid red', borderRadius: '8px'} : {}"
                      :placeholder="$t('page.user.profile.first_name')"
                      type="text"
                      name="first_name"
                    />
                  </div>
                </div>
              </label>
            </div>
            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.last_name") }}</span>

                <div class="form__input">
                  <div>
                    <input
                      v-validate="'required|alpha_spaces|min:2|max:50'"
                      data-vv-scope="mainProfile"
                      v-model="profile.last_name"
                      :style="errors.has('mainProfile.last_name') ? {border: '1px solid red', borderRadius: '8px'} : {}"
                      :placeholder="$t('page.user.profile.last_name')"
                      type="text"
                      name="last_name"
                    />
                  </div>
                </div>
              </label>
            </div>

            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.phone") }}</span>
                <div class="form__input">
                  <p>
                    <input
                      v-validate="'numeric|min:6|max:18'"
                      data-vv-scope="mainProfile"
                      v-model="profile.phone"
                      :style="errors.has('mainProfile.phone') ? {border: '1px solid red', borderRadius: '8px'} : {}"
                      :placeholder="$t('page.user.profile.phone_number')"
                      type="text"
                      name="phone"
                      autocomplete="off"
                    />
                  </p>
                </div>
              </label>
            </div>
            <div class="profile__buttons">
              <button
                class="btn btn-submit"
                @click.prevent="
                    main = false;
                    editMain({first_name: profile.first_name, last_name: profile.last_name, phone: profile.phone}).then(
                      () => (main = true)
                    );
                  "
              >
                <span v-if="main">{{ $t("ui.buttons.save") }}</span>
                <loader v-else :responsive="true" width="35" height="35"/>
              </button>
            </div>

          </div>
        </li>

        <li>
          <div class="profile__main--item">
            <p class="profile__main--title text-center">
              {{ $t("page.user.profile.password") }}
            </p>
            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.old") }}</span>
                <div class="form__input">
                  <p>
                    <input
                      v-model="profile.oldPassword"
                      :placeholder="$t('page.user.profile.current_password')"
                      type="password"
                      name="password"
                    />
                  </p>
                </div>
              </label>
            </div>

            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.new") }}</span>
                <div class="form__input">
                  <p>
                    <input v-model="profile.newPassword" :placeholder="$t('page.user.profile.new')" type="password"/>
                  </p>
                </div>
              </label>
            </div>
            <div class="form__item">
              <label>
                <span>{{ $t('page.user.profile.repeat_password') }}:</span>
                <div class="form__input">
                  <p>
                    <input
                      :placeholder="$t('page.user.profile.repeat_password')"
                      type="password"
                      name="password2"
                    />
                  </p>
                </div>
              </label>
            </div>


            <div class="profile__buttons">
              <button
                class="btn btn-submit"
                @click.prevent="setPassword"
              >
                <span v-if="password">{{ $t("ui.buttons.save") }}</span>
                <loader v-else :responsive="true" width="35" height="35"/>
              </button>
            </div>
          </div>
          <div class="profile__main--item b-top--none">
            <p class="profile__main--title text-center">
              {{ $t("page.user.profile.email") }}
            </p>
            <div class="form__item">
              <label>
                <span>{{ $t("page.user.profile.email") }}</span>
                <div class="form__input">
                  <p>
                    <input
                      v-validate="'required|email'"
                      data-vv-scope="emailProfile"
                      :style="errors.has('emailProfile.email') ? {border: '1px solid red', borderRadius: '1.25rem'} : {}"
                      v-model="profile.email"
                      type="text"
                      placeholder="example@mail.com"
                      name="email"
                    />
                  </p>
                </div>
              </label>
            </div>
            <div class="profile__buttons">
              <button class="btn btn-submit" @click.prevent="editEmail(profile)">
                <span v-if="email">{{ $t("ui.buttons.save") }}</span>
                <loader v-else :responsive="true" width="35" height="35"/>
              </button>
            </div>
          </div>
        </li>
        <li>
          <div class="profile__main--item">
            <p class="profile__main--title text-center">
              {{ $t("page.user.profile.account_protection") }}
            </p>
            <div class="text-center">
              <img src="~assets/img/secure.svg" alt=""/>
            </div>
            <div class="profile__buttons">
              <button
                v-if="info.secure2fa && !info.secure2fa.active"
                class="btn btn-submit"
                @click.prevent="setCreate(true)"
              >
                {{ $t("ui.buttons.2factor") }}
              </button>
              <button v-else class="btn btn-submit" @click.prevent="initOtpDelete = true">
                {{ $t("ui.buttons.reset2factor") }}
              </button>
            </div>
          </div>
          <div class="profile__main--item profile__main--item-last b-top--none">
            <p class="profile__main--title text-center">
              {{ $t("page.user.profile.notifications") }}
            </p>
            <div class="form__item checkbox-list">
              <div class="checkbox">
                <input id="notify" type="checkbox" v-model="profile.notifyChangePass"/>
                <label for="notify">{{ $t("page.user.profile.edit_password") }}</label>
              </div>
              <div v-if="false" class="checkbox">
                <input type="checkbox"/>
                <label>{{ $t("page.user.profile.receive_notification") }}</label>
              </div>
              <div class="checkbox">
                <input id="get_logged" type="checkbox" v-model="profile.notifyLogin"/>
                <label for="get_logged">{{ $t("page.user.profile.get_logged") }}</label>
              </div>
            </div>
            <div class="profile__buttons">
              <button
                class="btn btn-submit"
                @click.prevent="
                  editNotify({notifyLogin: profile.notifyLogin, notifyChangePass: profile.notifyChangePass}).then(
                      () => (main = true)
                    );
                "
              >
                <span v-if="notify">{{ $t("ui.buttons.save") }}</span>
                <loader v-else :responsive="true" width="35" height="35"/>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div class="footer-profile">
        <p> Deleting or blocking your account:</p>
        <div>
          <button class="btn btn-transparent" @click="deleteMyAccount"> {{
              $t("ui.buttons.delete_my_account")
            }}
          </button>
          <button class="btn btn-transparent" @click="blockMyAccount"> {{ $t("ui.buttons.block_my_account") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import auth2fa from "~/components/modals/auth";
import user from "~/components/user";

export default {
  components: {auth2fa, user},
  data() {
    return {
      profile: {},
      main: true,
      notify: true,
      initOtpDelete: false,
      email: true,
      password: true
    };
  },
  computed: {
    ...mapGetters({info: "user/info", load: "user/load"})
  },
  watch: {
    info() {
      this.profile = Object.assign({}, this.info, this.profile);
    }
  },
  mounted() {
    this.profile = Object.assign({}, this.info);
  },
  methods: {
    ...mapActions({
      editEmailAPI: "user/editEmail",
      blockAccount: "user/blockAccount",
      deleteAccount: "user/deleteAccount",
      editMainAPI: "user/editMain",
      editPassword: "user/editPassword",
      otpDeleteAPI: "user/otpDelete",
      destroySession: "user/destroyAuth"
    }),
    ...mapMutations("user", {setCreate: "create"}),
    async editEmail(data) {
      if (!(await this.$validator.validateAll("emailProfile"))) {
        return;
      }
      this.email = false;

      await this.editEmailAPI(data);
      this.email = true;
      return true;
    },
    async editMain(data) {
      
      if (!(await this.$validator.validateAll("mainProfile"))) {
        return;
      }
      this.notify = false;

      await this.editMainAPI(data);
      this.notify = true;
      return true;
    },

    async editNotify(data) {
      
      /* if (!(await this.$validator.validateAll("mainNotify"))) {
        return;
      } */
      this.notify = false;

      await this.editMainAPI(data);
      this.notify = true;
      return true;
    },

    async otpDelete(code2fa) {
      this.initOtpDelete = false;
      if (code2fa) {
        this.otpDeleteAPI({code: code2fa}).catch(error => {
          this.$swal("", error.message, "error");
        });
      }
    },
    async setPassword() {
      this.password = false;
      let passwordChanged = await this.editPassword(this.profile);
      this.password = true;
      if (passwordChanged) {
        console.log("[Unauthorized] Redirect to home page profile.vue/setPassword");
        this.$router.push(this.localePath('/'));
        this.$store.commit('user/login', true)
        this.$store.commit('user/info', null)
      }
    },
    async blockMyAccount() {
      const confirm = await this.$swal({
        title: this.$t("modals.profile.blockAccountTitle"),
        html: this.$t("modals.profile.blockAccountSubTitle"),
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("modals.profile.btnCancel"),
        confirmButtonText: this.$t("modals.profile.btnOk")
      }).then(r => Boolean(r.value));
      if (!confirm) return null;

      const confirm2 = await this.$swal({
        title: this.$t("modals.profile.sureTitle"),
        html: this.$t("modals.profile.sureBlockAccountSubTitle"),
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("modals.profile.btnCancel"),
        confirmButtonText: this.$t("modals.profile.btnSure")
      }).then(r => Boolean(r.value));
      if (!confirm2) return null;
      await this.blockAccount();
      console.log("[Unauthorized] Redirect to home page profile.vue/blockAccount");
      return this.$router.replace(this.localePath( "/"));
    },
    async deleteMyAccount() {
      const confirm = await this.$swal({
        title: this.$t("modals.profile.deleteAccountTitle"),
        html: this.$t("modals.profile.deleteAccountSubTitle"),
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("modals.profile.btnCancel"),
        confirmButtonText: this.$t("modals.profile.btnOk")
      }).then(r => Boolean(r.value));
      if (!confirm) return null;

      const confirm2 = await this.$swal({
        title: this.$t("modals.profile.sureTitle"),
        html: this.$t("modals.profile.sureDeleteAccountSubTitle"),
        icon: "question",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: this.$t("modals.profile.btnCancel"),
        confirmButtonText: this.$t("modals.profile.btnSure")
      }).then(r => Boolean(r.value));
      if (!confirm2) return null;
      await this.deleteAccount();
      console.log("[Unauthorized] Redirect to home page profile.vue/deleteAccount");
      return this.$router.replace(this.localePath("/"));
    }
  }
};
</script>
