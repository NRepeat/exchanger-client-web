<template>
  <div class="form-confirmation__give">
    <div class="form-confirmation__main--top">
      <h5 v-if="typeCurrency === 'from'" class="form-confirmation__main--title">
        {{ $t("page.exchange.form.from.title") }}
      </h5>
      <h5 v-if="typeCurrency === 'to'" class="form-confirmation__main--title">
        {{ $t("page.exchange.form.to.title") }}
      </h5>
      <div class="form-confirmation__main--currency">
        <div class="form-confirmation__main--currency__name">
          <img :src="$rest.urlImg(currency.image).medium" :alt="currency.name" />
          <span>{{ currency.name }}</span>
        </div>
        <p class="form-confirmation__main--currency__amount">
          {{ amount }} {{ currency.symbol }}
        </p>
      </div>
    </div>

    <div class="form-confirmation__main--address">
      <template v-for="val in requisites">
        <div class="form-confirmation__main--address__title">
          <span>{{ val.name }}:</span>
        </div>
        <p>{{ val.value }}</p>
      </template>
    </div>

    <div class="form-confirmation__main--bottom">
      <span>{{ $t("page.exchange.order.confirmation.total") }}:</span>
      <p>{{ amount }} {{ currency.symbol }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeCurrency: {
      type: String,
      default: "from"
    },
    currency: {
      type: Object,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    requisites: {
      type: Array,
      required: true
    }
  }
};
</script>
