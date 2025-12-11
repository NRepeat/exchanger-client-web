<template>
  <div class="form-confirmation__bottom--verification">

    <modal-files
      v-if="showUploadModal && showUploadModal.requiredImagesCount"
      type-verification="file"
      :text="showUploadModal.text"
      :orderId="order._id"
      :orderStatus="showUploadModal.status"
      :required-images-count="showUploadModal.requiredImagesCount || 1"
      @close="
        showUploadModal = {}
      "
    />


    <div
      v-for="document in requiredDocuments"
      class="form-confirmation__bottom--verification__item"
    >
      <div>
        <img v-if="document.status === 'approve'" src="~assets/img/doc-green.svg" alt="doc" />
        <img v-else src="~assets/img/doc.svg" alt="doc" />
        <span>{{ titleTranslate(document.title) }} </span>
      </div>
      <p>
        <a @click="showUploadModal = document">Upload</a>
      </p>
    </div>
  </div>
</template>

<script>
import modalFiles from "~/components/modals/document";

export default {
  components: {modalFiles},
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timerUpdate: null,
      showUploadModal: {},
    };
  },
  computed: {
    requiredDocuments() {
      if (!this.order.route.requiredDocuments)
        return [];
      return this.order.route.requiredDocuments.filter(el => {
        return el.status === this.order.status
      })
    },
  },
  created() {
    // if (this.verificationsStatus) {
    //   this.verifications.verificationCurrency = this.verificationsStatus.verificationCurrency || {status: null};
    //   this.verifications.verificationCurrencyPayout = this.verificationsStatus.verificationCurrencyPayout || {status: null};
    //   this.verifications.verificationUser = this.verificationsStatus.verificationUser || {status: null};
    // }
    // if (!this.order.route.from.verification && !this.order.route.to.verificationPayout && !this.order.route.verification) {
    //   this.updateStatusVerif(true);
    //   return;
    // }
    // if (!this.order.route.verification || this.verifications.verificationUser.status === "approve") {
    //   if (!this.order.route.from.verification || this.verifications.verificationCurrency.status === "approve") {
    //     if (!this.order.route.to.verificationPayout || this.verifications.verificationCurrencyPayout.status === "approve") {
    //       this.updateStatusVerif(true);
    //     }
    //   }
    // }
    //
    // this.timerUpdate = setInterval(() => {
    //   if (this.order.route.from.verification || this.order.route.to.verificationPayout || this.order.route.verification) {
    //     this.checkFullVerif();
    //   }
    // }, 8000);
  },
  beforeDestroy() {
    // clearInterval(this.timerUpdate);
  },
  methods: {
    titleTranslate(title) {  
      let resultContent = "";
      const content = title.split("##");
      
      if(title.includes("##")){
      for (let i = 0; i < content.length; i++) {
        if (content[i].length === 2) {
          if (content[i] !== this.$i18n.locale) {
            i++;
          }
        } else {
          resultContent += content[i];
        }
      }
      }else{
        resultContent = title
      }
      return resultContent;
    }
    // updateStatusVerif(newStatus) {
    //   if (this.fullVerifed !== newStatus && newStatus) {
    //     this.$emit("updateVerifStatus", true);
    //     clearInterval(this.timerUpdate);
    //   }
    // },
    // checkFullVerif() {
    //   this.$rest
    //     .api("GET:public/exchanger/verification/find/by-order-id", {orderId: this.order._id})
    //     .then(r => r.data.verifications)
    //     .then(verifications => {
    //       // console.log(verifications)
    //       this.verifications.verificationCurrency = verifications.verificationCurrency || {status: null};
    //       this.verifications.verificationCurrencyPayout = verifications.verificationCurrencyPayout || {status: null};
    //       this.verifications.verificationUser = verifications.verificationUser || {status: null};
    //       if (!this.order.route.from.verification && !this.order.route.to.verificationPayout && !this.order.route.verification) {
    //         this.updateStatusVerif(true);
    //         return;
    //       }
    //       if (this.order.route.verification && this.verifications.verificationUser.status !== "approve") {
    //         return;
    //       }
    //       if (this.order.route.from.verification && this.verifications.verificationCurrency.status !== "approve") {
    //         return;
    //       }
    //       if (this.order.route.to.verificationPayout && this.verifications.verificationCurrencyPayout.status !== "approve") {
    //         return;
    //       }
    //
    //       this.updateStatusVerif(true);
    //     });
    // }
  }
};
</script>
