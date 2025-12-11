<template>
  <div class="partner-order-states">
    <div class="under-header">
      <div class="form-confirmation">
        <div class="container" style="min-height:65vh;">
          <div class="form-confirmation-manual-bloc">
            <div class="form-confirmation-manual-number">
              <h1>
                Withdrawal rewards
              </h1>
              <p>
                {{ $t("page.user.order.order_id") }}
                <span>#{{ $route.params.partnerOrder }}</span>
              </p>
            </div>

            <transition name="faded">
              <partnerOrder />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import partnerOrder from "~/components/partnerOrder/index";

export default {
  components: {partnerOrder}
};
</script>
