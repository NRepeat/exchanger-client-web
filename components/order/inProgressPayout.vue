<template>
  <div>
    <div v-if="order && order.comment" class="form-attention">
      <h4>{{ $t("page.news.news.comment") }}:</h4>
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
        <p class="title">{{ $t("page.exchange.order.Were_start_paying_to_you") }}</p>
        <br/>
        <p>{{ $t("page.exchange.order.we_will_transfer_money_as_soon_as_possible") }}</p>
      </div>
      <documents-uploader :order="order" />
    </div>
  </div>
</template>
<script>
import currency from "~/components/order/subcomponents/currency";
import contactsData from "~/components/order/subcomponents/contactsData";
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
            return item.step === "resultOrder";
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
