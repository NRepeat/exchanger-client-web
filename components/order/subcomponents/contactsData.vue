<template>
  <div class="form-confirmation__contact">
    <p>{{ $t("page.exchange.order.confirmation.contact_details") }}</p>
    <ul>
      <li v-for="val in routeValues" :key="val.id">
        <span>{{ val.name }}:</span>
        {{ val.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    routeValues: {
      type: Array,
      required: true
    }
  }
};
</script>
