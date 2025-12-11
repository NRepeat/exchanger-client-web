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
      <div class="form-manual-must text-center">
        <documents-uploader :order="order" />

        <p class="title">{{ $t("page.exchange.order.deletedTitle") }}</p>
        <br />
        <p>{{ $t("page.exchange.order.deletedDesc") }}</p>
      </div>
      <div v-if="order.clientCallbackUrl" class="form-v2--input-order-form-btn text-center" style="padding: 20px">
        <a
          :href="order.clientCallbackUrl+'?status=error'"
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
            return item.step === "deleteOrder";
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
