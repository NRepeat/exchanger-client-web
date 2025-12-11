<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <span class="btn_close" @click.self="$emit('close')">×</span>

            <slot name="header">
              <h3>{{ $t("page.user.order.howToIncreaseThePercentageOfAffiliateCommission") }}</h3>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <p class="about_description">
                {{ $t("page.user.order.toChangeThePercentageOfAffiliateCommissionPlease") }}
              </p>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="btn_position">
                <a class="modal-default-button ok_btn" @click="$emit('close')">Ок</a>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
