<template>
  <v1 v-if="activeVersion === 'v1'" />
  <v2 v-else-if="activeVersion === 'v2'" />
  <v3 v-else-if="activeVersion === 'v3'" />
  <div v-else>
    <h2>Error template {{ activeVersion }} not found please set correct config</h2>
    <p>
      <b>./config/app.json</b>
      "styles:exchangeForm" must be <b>v1</b> - select options, <b>v2</b> - list, <b>v3</b> - inputs
    </p>
  </div>
</template>
<script>
import v1 from "~/components/homepage/exchangeForms/v1";
import v2 from "~/components/homepage/exchangeForms/v2";
import v3 from "~/components/homepage/exchangeForms/v3";

export default {
  components: {v1, v2, v3},
  data() {
    return {activeVersion: this.$rest.config.styles.exchangeForm};
  }
};
</script>
