<template>
 <!--todo: for future-->
  <p v-if="outFee">
    {{ $t("page.main.to.fee") }}
    <span>{{ `-${outFee}  ${currency}` }}</span>
  </p>
</template>

<script>
export default {
  props: {
    outFee: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: ""
    }
  }
}
</script>
