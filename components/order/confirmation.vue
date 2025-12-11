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

    <div v-if="order.TYPE !== 'payment'" class="payment-data_content_header">
      <p>{{ $t("page.exchange.order.confirmation.checkAndConfirm") }}</p>
    </div>

    <ul v-if="order.TYPE !== 'payment'" class="details-confirm-order">
      <!-- currency to -->
      <li class="details-confirm-order-currency">
        <div class="details-currency_logo form-v2--input-order-form">
          <p>{{ $t("page.exchange.order.confirmation.youReceive") }}</p>
          <div class="receive">
            <div>
              <img :src="$rest.urlImg(order.route.to.image).medium" :alt="order.route.to.name">
              <span> {{ order.route.to.name }}</span>
            </div>
            <span>{{ order.outAmount }} {{ order.route.to.symbol }}</span>
          </div>
        </div>
      </li>
      <!-- END currency to -->
      <!-- Requisites form (for confirm) -->
      <li v-for="val in order.toValues" class="details-confirm-order-requisites "
          :key="val.name + 'toValues'">
        <div class="form-v2--input-order-form">
          <p>{{ val.name }}:</p>
          <div class="other">
            <span>{{ val.value }}</span>
          </div>
        </div>
      </li>
      <li v-for="val in order.routeValues" class="details-confirm-order-requisites" :key="val.name + 'routeValues'">
        <div class="form-v2--input-order-form">
          <p>{{ val.name }}:</p>
          <div class="other">
            <span>{{ val.value }}</span>
          </div>
        </div>
      </li>
      <!-- END Requisites form (for confirm) -->
    </ul>
    <!-- Verification btns (and modal)-->
    <verification :order="order" :verifications-status="verificationsStatus" @updateVerifStatus="readyOrder = true"/>
    <documents-uploader :order="order" />
    <!-- END Verification btns -->
    <div class="form-v2--input-order-form-btn">
      <button
        :style="{opacity: !readyOrder ? 0.6 : 1}"
        class="btn btn-submit-order btn-submitForm"
        @click="readyOrder ? $emit('confirm', 'waitPayment') : null"
      >
        {{ $t("page.exchange.order.confirmation.pay") }}
      </button>
    </div>

  </div>
</template>

<script>
import verification from "~/components/order/subcomponents/verification";
import DocumentsUploader from "@/components/order/subcomponents/documentsUploader.vue";

export default {
  components: {
    DocumentsUploader,
    verification
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    verificationsStatus: {
      type: Object,
      default: () => ({})
    },
    isPaymentType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {readyOrder: false};
  },
  computed: {
    instructions() {
      if (this.order)
        return this.order.route.instructions
          .filter(item => {
            return item.step === "confirmation";
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
