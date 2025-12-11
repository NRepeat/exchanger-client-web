<template>
  <div>
    <transition name="faded">
      <div
        class="deposit-modal__rate"
        v-if="currentRoute.from && currentRoute.from.min > 0"
      >
        <p>min:</p>
        <p>
          {{ currentRoute.from.min }}
          {{ currentRoute.from.symbol }}
        </p>
      </div>
    </transition>

    <transition name="faded">
      <div
        class="deposit-modal__rate"
        v-if="currentRoute.from && currentRoute.from.max > 0"
      >
        <p>max:</p>
        <p>
          {{ currentRoute.from.max }}
          {{ currentRoute.from.symbol }}
        </p>
      </div>
    </transition>

    <transition name="faded">
      <div
        class="deposit-modal__rate"
        v-if="currentRoute.rate && currentRoute.rate.amount"
      >
        <p>{{ $t('modals.partner.get_money.limit') }}:</p>
        <p>
          {{ currentRoute.rate.amount }}
          {{ currentRoute.to.symbol }}
        </p>
      </div>
    </transition>

    <transition name="faded">
      <div class="deposit-modal__rate" v-if="rateIn > 0 || rateOut > 0">
        <p>
          {{ $t("page.main.to.rate") }}
        </p>
        <p>
          <span v-if="rateIn > 10"
            >{{ Number((+rateIn || 1).toFixed(2)) }}:</span
          >
          <span v-else-if="rateIn > 1">
            {{ Number((+rateIn || 1).toFixed(3)) }}:
          </span>
          <span v-else>{{ Number((+rateIn || 1).toFixed(4)) }}:</span>
          <span v-if="rateOut > 10">{{
            Number((+rateOut || 1).toFixed(2))
          }}</span>
          <span v-else-if="rateOut > 1">
            {{ Number((+rateOut || 1).toFixed(3)) }}
          </span>
          <span v-else>{{ Number((+rateOut || 1).toFixed(4)) }}</span>
        </p>
      </div>
    </transition>

    <transition name="faded">
      <div
        class="deposit-modal__rate"
        v-if="currentRoute.rate && currentRoute.rate.outFeeAmount"
      >
        <p>
          {{ $t("page.main.to.fee") }}
        </p>
        <p>
          <span>
            -{{ currentRoute.rate.outFeeAmount }}
            {{ currentRoute.to.symbol }}</span
          >
        </p>
      </div>
    </transition>

    <transition name="faded">
      <div class="deposit-modal__data" v-if="!loadRouteGet">
        <div class="deposit-modal__data-row">
          <div v-if="currentRoute.from.image" class="deposit-modal__data-logo">
            <img :src="$rest.urlImg(currentRoute.from.image).small" alt />
          </div>
          <div class="deposit-modal__data-name">
            {{ currentRoute.from.name }}
            <span class="deposit-modal__data-sum"
              >{{ val1 || 0 }} {{ currentRoute.from.symbol }}</span
            >
          </div>

          <div class="deposit-modal__data-img">
            <img src="~assets/img/arr.svg" alt />
          </div>
        </div>
        <div class="deposit-modal__data-row">
          <div v-if="currentRoute.to.image" class="deposit-modal__data-logo">
            <img :src="$rest.urlImg(currentRoute.to.image).small" alt />
          </div>
          <div class="deposit-modal__data-name">
            {{ currentRoute.to.name }}
            <span class="deposit-modal__data-sum"
              >{{ val2 || 0 }} {{ currentRoute.to.symbol }}</span
            >
          </div>

          <div class="deposit-modal__data-img deposit-modal__data-img--reverse">
            <img src="~assets/img/arr.svg" alt />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";

export default {
	name: "depositData",
  props: {
    loadRouteGet: {
      type: Boolean,
      default: true,
    },
    val1: {
      type: String,
      default: "",
    },
    val2: {
      type: Number,
      default: 0,
    },
    currentRoute: {
      type: Object,
      default: () => ({
        to: {},
        from: {},
        rate: {},
        isAutoPayout: true,
        routeId: "",
      }),
    },
  },
  data() {
    return {};
  },
  computed: {
    rateIn() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.in
      )
        return 0;
      let rate = new BigNumber(this.currentRoute.rate.in);
      let discountPercent = 0;
      /* const discount = this.currentRoute.from.discounts.find(
              (el) => Number(el.amountMoreThan) <= this.val1
            );
            if (discount && discount.discountPercent) {
              discountPercent = Number(discount.discountPercent);
            } */
      rate = rate.minus(
        new BigNumber(rate).div(100).multipliedBy(discountPercent)
      );
      return rate;
    },
    rateOut() {
      if (
        !this.currentRoute ||
        !this.currentRoute.rate ||
        !this.currentRoute.rate.out
      )
        return 0;
      let rate = new BigNumber(this.currentRoute.rate.out);
      return rate;
    },
  },
};
</script>
