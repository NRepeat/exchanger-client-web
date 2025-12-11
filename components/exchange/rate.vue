<template>
  <!--todo: for future-->
  <p>
    {{ $t("page.main.to.rate") }}
    <span v-if="rateIn > 10">{{ Number((+rateIn || 1).toFixed(2)) }}:</span>
    <span v-else-if="rateIn > 1">
                  {{ Number((+rateIn || 1).toFixed(3)) }}:
                </span>
    <span v-else>{{ Number((+rateIn || 1).toFixed(4)) }}:</span>
    <span v-if="rateOut > 10">{{ Number((+rateOut || 1).toFixed(2)) }}</span>
    <span v-else-if="rateOut > 1">
                  {{ Number((+rateOut || 1).toFixed(3)) }}
                </span>
    <span v-else>{{ Number((+rateOut || 1).toFixed(4)) }}</span>
  </p>
</template>

<script>
import {BigNumber} from "bignumber.js";

export default {
  props: {
    discountsFrom: {
      type: Array,
      default: []
    },
    routeRateIn: {
      type: Number,
      default: 0
    },
    routeRateOut: {
      type: Number,
      default: 0
    },
    amountIn: {
      type: Number,
      default: 0
    }
  },
  computed: {
    rateIn() {
      let rate = new BigNumber(this.routeRateIn);
      let discountPercent = 0;
      const discount = this.discountsFrom.find(el => Number(el.amountMoreThan) <= this.amountIn);
      if (discount && discount.discountPercent) {
        discountPercent = Number(discount.discountPercent);
      }
      rate = rate.minus(
        new BigNumber(rate)
          .div(100)
          .multipliedBy(discountPercent)
      );
      return rate;
    },
    rateOut() {
      return new BigNumber(this.routeRateOut);
    },
  }
}
</script>