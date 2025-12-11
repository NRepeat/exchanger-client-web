<template>
  <div>
    <div v-if="order && order.comment" class="form-attention" style="margin: 0.85em 2.585em 0.75em;">
      <h4 class="form-confirmation__main--title">{{ $t("page.news.news.comment") }}:</h4>
      {{ order.comment }}
    </div>
    <p
      v-for="instruction in instructions"
      :key="instruction._id"
      class="form-attention"
      v-html="instruction.content"
    />
    <div>
      <documents-uploader :order="order" />

      <div class="form-manual-must text-center">
        <p class="title">{{ $t("page.exchange.order.doneTitle") }}</p>
        <br />
        <p>{{ $t("page.exchange.order.doneDesc") }}</p>
      </div>

      <div class="done-banner-block">
        <div v-if="doneTexts.length > 0"
          class="done-banner-block__text"
          v-for="doneText in doneTexts"
          :key="doneText._id"
          v-html="doneText.content"
        ></div>
      </div>
      

      <div v-if="order.clientCallbackUrl" class="form-v2--input-order-form-btn text-center" style="padding: 20px">
        <a
          :href="order.clientCallbackUrl + '?status=success'"
          rel="nofollow"
          class="btn btn-submit"
        >
          Return to site
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import currency from "~/components/order/subcomponents/currency";
import contactsData from "~/components/order/subcomponents/contactsData";
import verification from "~/components/order/subcomponents/verification";
import DocumentsUploader from "@/components/order/subcomponents/documentsUploader.vue";

export default {
  components: {
    DocumentsUploader,
    currency,
    contactsData
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    isPaymentType: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    instructions() {
      if (this.order)
        return this.order.route.instructions
          .filter(item => {
            return item.step === "successOrder";
          })
          .map(item => {
            let resultContent = "";
            const content = item.content.split("##");
            for (let i = 0; i < content.length; i++) {
              if (content[i].length === 2) {
                if (content[i] !== this.$i18n.locale) {
                  i++;
                }
              } else {
                resultContent += content[i];
              }
            }
            return {...item, content: resultContent};
          });
    },

    doneTexts() {
      if (this.order)
        return this.order.route.instructions
          .filter(item => {
            return item.step === "doneOrder";
          })
          .map(item => {
            let resultContent = "";
            const content = item.content.split("##");
            for (let i = 0; i < content.length; i++) {
              if (content[i].length === 2) {
                if (content[i] !== this.$i18n.locale) {
                  i++;
                }
              } else {
                resultContent += content[i];
              }
            }
            return {...item, content: resultContent};
          });
    }
  }
};
</script>
