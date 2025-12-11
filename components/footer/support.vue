<template>
  <div class="footer footer-support">
    <div class="container ">
      <footerContacts :is-footer="true" color="white" :is-page="true" />
      </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import footerContacts from "~/components/footer/footerContacts";

export default {
  components: {footerContacts},
  props: {},
  data() {
    return {email: "", message: "", loader_sendMessageToSupport: false};
  },
  computed: {
    ...mapGetters("contacts", {
      info: "getData",
      load: "getLoad"
    }),
    lang(){
      return this.$i18n.locale;
    }
  },
  created() {
    if (this.info.length === 0) return this.getContacts(this.lang);
  },
  methods: {
    ...mapActions("contacts", {
      getContacts: "getContacts"
    }),
    async sendMessageToSupport() {
      if (!(await this.$validator.validateAll("support"))) return;

      this.loader_sendMessageToSupport = true;
      const apiResult = await this.$rest
        .api("POST:public/ticket/create", {email: this.email, message: this.message})
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
  }
};
</script>

<style scoped>
textarea {
  color: #fff;
}

input {
  color: #fff;
}
</style>
