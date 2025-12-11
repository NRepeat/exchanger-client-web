<template>
  <div class="payment-wait">
    <div class="under-header">
      <div class="form-confirmation">
        <div class="container">
          <div v-if="load && order && order.status" class="form-confirmation__up">
            <div class="form-confirmation-manual-bloc">
              <div class="form-confirmation-manual-number">
                <p>
                  {{ $t("page.user.order.order_id") }}
                  <span><b>#{{ $route.params.order }}</b></span>
                </p>
                <p class="actual-time">
                  {{ $t("page.user.order.actual_until") }}
                  <span>
                    <b>{{ $moment(order.expiresAt).format("DD MMM YYYY, HH:mm") }}</b>
                  </span>
                </p>
<!--                <h1 v-if="order.status === 'new'">-->
<!--                  {{ $t("page.user.order." + order.status) }}-->
<!--                </h1>-->
              </div>
              <div
                v-if="order.status === 'new' || order.status === 'waitPayment'"
                class="form-confirmation-manual-actual"
              >
                <div class="form-confirmation-manual-actual-info">
                  <p>{{ $t("page.user.order.time_left") }}</p>
                  <p>
                    <b>{{ time }}</b>
                  </p>
                </div>
              </div>
            </div>

            <component
              :is="comps[order.status]"
              :order="order"
              :is-payment-type="true"
              :verifications-status="verificationsStatus"
              @confirm="
                  changeOrder({
                    orderUID: $route.params.order,
                    orderSecret: $route.params.secret,
                    status: $event
                  })
                "
            />

          </div>
          <loader v-if="!load"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

import confirmation from "~/components/order/confirmation";
import waitPayment from "~/components/order/wait";
import hold from "~/components/order/hold";
import returned from "~/components/order/returned";
import deleted from "~/components/order/deleted";
import inProgress from "~/components/order/progress";
import errorPayout from "~/components/order/errorPayout";
import errorPayment from "~/components/order/errorPayout";
import done from "~/components/order/done";
import inProgressPayout from "~/components/order/inProgressPayout";

export default {
  layout: "payment",
  head() {
    const {meta, title} = this.$seo({
      name: "Payment",
      title: "Payment",
      description: "Payment",
      openGraph: {
        title: "Payment",
        description: "Payment",
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath, width: 100, height: 100, type: 'image/png'}
      }
    });
    return {meta, title};
  },
  data() {
    return {
      val: true,
      timeout: "",
      comps: {
        waitPayment,
        deleted,
        inProgress,
        errorPayout,
        errorPayment,
        done,
        hold,
        returned,
        inProgressPayout,
        new: confirmation
      }
    };
  },
  computed: {
    ...mapGetters({
      order: "exchange/order",
      getRequestStateExchange: "exchange/getRequestState",
      verificationsStatus: "exchange/verificationsStatus",
      load: "exchange/load"
    }),
    time() {
      const diff_ = this.$moment(this.order.expiresAt).diff();
      if ((this.val || !this.val) && diff_ >= 3600000) {
        const HH = Math.floor(this.$moment.duration(diff_).asHours());
        const timeLive = this.$moment(diff_).utc();
        return HH + ":" + timeLive.format("mm:ss");
      } else if ((this.val || !this.val) && diff_ >= 0) {
        const timeLive = this.$moment(diff_).utc();
        return timeLive.format("mm:ss");
      } else {
        return "00:00";
      }
    }
  },
  beforeDestroy() {
    this.$events.$off("ws/emit/updateOrder");
    clearTimeout(this.timeout);
  },
  created() {
    if (process.server)
      return null;

    if (!this.getRequestStateExchange("getOrder", "isPending")) {
      this.getOrder({
        type: "payment",
        orderUID: this.$route.params.order,
        orderSecret: this.$route.params.secret
      });
    }
    this.checkTimeOut(false);
    this.$events.$on("ws/emit/updateOrder", param => {
      setTimeout(() => {
        if (param.order === this.order._id && !this.getRequestStateExchange("getOrder", "isPending")) {
          this.getOrder({
            type: "payment",
            orderUID: this.$route.params.order,
            orderSecret: this.$route.params.secret
          });
        }
      }, 100);
    });
  },
  methods: {
    ...mapActions({getOrder: "exchange/getOrder", changeOrder: "exchange/changeOrder"}),
    checkTimeOut(val) {
      if (this.min <= 0 && this.sec <= 0) {
        return clearTimeout(this.timeout);
      }
      this.val = val;
      this.timeout = setTimeout(() => this.checkTimeOut(!val), 500);
    }
  }
};
</script>
