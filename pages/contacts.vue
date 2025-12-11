<template>
  <div>
    <div class=" specification-top-wr">
      <div class="container">
        <div class="contact-page-top">
          <div>
            <h1>{{ $t("page.contacts.title") }}</h1>
            <p>{{ $t("page.contacts.warn") }}</p>
          </div>
          <div v-if="getJivoSite">
            <no-ssr>
              <button
                class="btn btn-submit"
                onclick="(window.jivo_api && window.jivo_api.open)
               ? window.jivo_api.open()
               : console.log('jivosite not found')"
              >{{ $t("page.contacts.chat") }}
              </button>
            </no-ssr>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-main">
      <div class="container">
        <footerContacts color="black" :is-page="false" />
        <div>
          <form action class="form" onsubmit="return false;">
            <div class="contact-main-form">
              <h4 class="title text-center">{{ $t("page.contacts.feedback") }}</h4>
              <p>
                <input
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-scope="support"
                  :style="errors.has('support.email') ? {border: '1px solid red'} : {}"
                  name="email"
                  type="email"
                  :placeholder="$t('page.contacts.your_email')"
                />
              </p>
              <p>
                <textarea
                  v-model="message"
                  v-validate="'required|min:6'"
                  data-vv-scope="support"
                  :style="errors.has('support.message') ? {border: '1px solid red'} : {}"
                  name="message"
                  :placeholder="$t('page.contacts.msg_text')"
                  cols="30"
                  rows="10"
                />
              </p>
              <div class="text-center">
                <button
                  class="btn btn-submit"
                  @click="sendMessageToSupport"
                >{{ $t("page.contacts.send_btn") }}
                </button>
              </div>
            </div>
            <div class="form-ruls">
              <p class="text-center">
                {{ $t("page.contacts.agree") }}
                <nuxt-link
                  :to="localePath('/rules/')"
                >{{ $t("page.contacts.agree_rules") }}
                </nuxt-link>
                {{ "." }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import footerContacts from "~/components/footer/footerContacts";

export default {
  components: {footerContacts},
  head() {
    const {meta, title} = this.$seo({
      name: this.$i18n.t("meta.contacts.title"),
      title: this.$i18n.t("meta.contacts.title"),
      description: this.$i18n.t("meta.contacts.description"),
      openGraph: {
        title: this.$i18n.t("meta.contacts.title"),
        description: this.$i18n.t("meta.contacts.description"),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath, width: 100, height: 100, type: 'image/png'}
      }
    });
    return {meta, title};
  },
  data() {
    return {email: "", message: "", loader_sendMessageToSupport: false};
  },
  async asyncData({params, app, seo}) {

  },
  computed: {
    ...mapGetters({getJivoSite: "params/getJivoSite"}),
    ...mapGetters("contacts", {
      info: "getData",
      load: "getLoad"
    }),
    lang(){
      return this.$i18n.locale;
    }
  },
  methods: {
    ...mapActions("contacts", {
      getContacts: "getContacts"
    }),
    async sendMessageToSupport() {
      if (!(await this.$validator.validateAll("support"))) return;

      this.loader_sendMessageToSupport = true;
      const apiResult = await this.$rest
        .api("POST:public/ticket/create", {
          email: this.email,
          message: this.message
        })
        .catch(err => {
          this.$swal("", err.message, "error");
          return null;
        });
      this.loader_sendMessageToSupport = false;
      if (apiResult) {
        this.$swal("", this.$t("page.contacts.requestAccepted"), "success");
        this.email = "";
        this.message = "";
        process.nextTick(() => this.$validator.errors.clear());
      }
    }
  },
  // eslint-disable-next-line vue/order-in-components
  created() {
    if (!this.info.length) this.getContacts(this.lang);
  },
};
</script>
