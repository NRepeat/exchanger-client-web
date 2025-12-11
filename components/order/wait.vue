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


    <!--    <div>-->
    <div
      v-if="order.route.from.paymentDetails.merchantEnabled && order.route.from.paymentDetails.merchant"
      class="form-manual-wait"
    >
      <component
        :is="order.route.from.paymentDetails.merchant.template"
        :order="order"
        :pay-data="order.route.from.paymentDetails.merchant.data"
        :qrcode-size="200"
        qrcode-background="#ffffff"
        qrcode-foreground="#000000"
      />
      <documents-uploader :order="order" />
      <button v-if="false" style="padding: 15px;margin: 0;" class="btn btn-reject" @click="$emit('confirm', 'deleted')">
        {{ $t("page.exchange.order.confirmation.cancel") }}
      </button>
    </div>

    <div
      v-else-if="order.route.from.paymentDetails.manualPaymentTextEnabled"
      class="form-manual-must text-center"
    >
      <p v-html="manualPaymentText" />
      <documents-uploader :order="order" />

      <div v-if="order.route.from.paymentDetails.showIPaidBtn !== false" class="text-center">
        <button class="btn btn-submit" @click="$emit('confirm', 'inProgress')">
          {{ $t("page.exchange.order.wait.btn") }}
        </button>
      </div>
    </div>


    <div v-else>
      <div class="form-manual-must text-center">
        <p class="title">{{ $t("page.exchange.order.wait.title") }}</p>

        <ul>
          <li v-if="order.route.from.paymentDetails.showStepLink !== false">
            <p>{{ $t("page.exchange.order.wait.step.log_in_to") }}</p>
            <a :href="order.route.from.paymentDetails.linkPS" target="_blank" class="btn btn-log-in">
              <img :src="$rest.urlImg(order.route.from.image.files).small" alt="" />
              <span>{{ order.route.from.name }}</span>
            </a>
          </li>

          <li>
            <p>{{ $t("page.exchange.order.wait.step.amount") }}</p>
            <div class="value-manual-payment">
              {{ order.inAmount }} {{ order.route.from.symbol }}

              <img v-clipboard:copy="order.inAmount" v-clipboard:success="onCopy"
                   src="~assets/img/copy-documents-option.svg" alt="copy-documents" />
            </div>
          </li>

          <li>
            <p>{{ $t("page.exchange.order.wait.step.to_account") }}</p>
            <div class="value-manual-payment">
              {{ manualAccount }}

              <img v-clipboard:copy="manualAccount"
                   v-clipboard:success="onCopy"
                   src="~assets/img/copy-documents-option.svg" alt="copy-documents" />
            </div>
          </li>

          <li v-if="order.route.from.paymentDetails.showStepComment !== false">
            <p>{{ $t("page.exchange.order.wait.step.comment") }}</p>
            <div class="value-manual-payment">
              {{ comment }}

              <img v-clipboard:copy="comment" v-clipboard:success="onCopy" src="~assets/img/copy-documents-option.svg"
                   alt="copy-documents" />

            </div>
          </li>
        </ul>
      </div>
      <documents-uploader :order="order" />

      <div class=" form-v2--input-order-form-btn text-center">

        <button
          v-if="order.route.from.paymentDetails.showIPaidBtn !== false"
          class="btn  btn-submit-order "
          @click="$emit('confirm', 'inProgress')"
        >
          {{ $t("page.exchange.order.wait.btn") }}
        </button>
      </div>
    </div>

    <!--        <currency-->
    <!--          v-if="!isPaymentType"-->
    <!--          type-currency="to"-->
    <!--          :currency="order.route.to"-->
    <!--          :amount="order.outAmount"-->
    <!--          :requisites="order.toValues"-->
    <!--        />-->
    <!--    </div>-->
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
    contactsData,
    verification
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
  data() {
    return {
      show: false
    };
  },
  computed: {
    manualAccount() {
      if (
        !this.order ||
        !this.order.route ||
        !this.order.route.from ||
        !this.order.route.from.paymentDetails ||
        !this.order.route.from.paymentDetails.account
      )
        return "";
      let resultContent = "";
      const content = this.order.route.from.paymentDetails.account.split("##");
      for (let i = 0; i < content.length; i++) {
        if (content[i].length === 2) {
          if (content[i] !== this.$i18n.locale) {
            i++;
          }
        } else {
          resultContent += content[i];
        }
      }
      return resultContent;
    },
    manualPaymentText() {
      if (
        !this.order ||
        !this.order.route ||
        !this.order.route.from ||
        !this.order.route.from.paymentDetails ||
        !this.order.route.from.paymentDetails.manualPaymentText
      )
        return "";
      let resultContent = "";
      const content = this.order.route.from.paymentDetails.manualPaymentText
        .replace(new RegExp("\\[\\[uid\\]\\]", "gi"), this.order.uid) // уникальный номер заявки
        .replace(new RegExp("\\[\\[account\\]\\]", "gi"), this.manualAccount) // счет депозита (Z123)
        .replace(new RegExp("\\[\\[inAmount\\]\\]", "gi"), this.order.inAmount) // сумма обмена in (99.42)
        .replace(new RegExp("\\[\\[inNameCurrency\\]\\]", "gi"), this.order.route.from.name) // имя валюты обмена in (WebMoney)
        .replace(new RegExp("\\[\\[inSymbol\\]\\]", "gi"), this.order.route.from.symbol) // символ валюты in (USD)
        .replace(new RegExp("\\[\\[outAmount\\]\\]", "gi"), this.order.outAmount) // сумма обмена  out (6300.31)
        .replace(new RegExp("\\[\\[outNameCurrency\\]\\]", "gi"), this.order.route.to.name) // имя валюты out (Qiwi)
        .replace(new RegExp("\\[\\[outSymbol\\]\\]", "gi"), this.order.route.to.symbol)
        .split("##");
      for (let i = 0; i < content.length; i++) {
        if (content[i].length === 2) {
          if (content[i] !== this.$i18n.locale) {
            i++;
          }
        } else {
          resultContent += content[i];
        }
      }
      return resultContent;
    },
    comment() {
      if (
        !this.order ||
        !this.order.route ||
        !this.order.route.from ||
        !this.order.route.from.paymentDetails ||
        !this.order.route.from.paymentDetails.commentTemplate
      )
        return "" + this.order.uid;
      let resultContent = "";
      const content = this.order.route.from.paymentDetails.commentTemplate
        .replace(new RegExp("\\[\\[uid\\]\\]", "gi"), this.order.uid) // уникальный номер заявки
        .replace(new RegExp("\\[\\[account\\]\\]", "gi"), this.manualAccount) // счет депозита (Z123)
        .replace(new RegExp("\\[\\[inAmount\\]\\]", "gi"), this.order.inAmount) // сумма обмена in (99.42)
        .replace(new RegExp("\\[\\[inNameCurrency\\]\\]", "gi"), this.order.route.from.name) // имя валюты обмена in (WebMoney)
        .replace(new RegExp("\\[\\[inSymbol\\]\\]", "gi"), this.order.route.from.symbol) // символ валюты in (USD)
        .replace(new RegExp("\\[\\[outAmount\\]\\]", "gi"), this.order.outAmount) // сумма обмена  out (6300.31)
        .replace(new RegExp("\\[\\[outNameCurrency\\]\\]", "gi"), this.order.route.to.name) // имя валюты out (Qiwi)
        .replace(new RegExp("\\[\\[outSymbol\\]\\]", "gi"), this.order.route.to.symbol)
        .split("##");
      for (let i = 0; i < content.length; i++) {
        if (content[i].length === 2) {
          if (content[i] !== this.$i18n.locale) {
            i++;
          }
        } else {
          resultContent += content[i];
        }
      }
      return resultContent;
    },
    instructions() {
      if (this.order)
        return this.order.route.instructions
          .filter(item => {
            return item.step === "payment";
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
  },
  mounted() {
    this.show = true;
  },
  methods: {
    onCopy() {
      this.$store.dispatch("notify/add", {
        message: this.$t("page.exchange.copied")
      });
    }
  }
};
</script>
