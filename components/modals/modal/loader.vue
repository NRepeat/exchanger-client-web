<template>
  <div style="width: 100%;min-height: 70px">
    <loader v-if="!errorData" :status_load="false" type="block" />
    <div v-else>{{ errorData.message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    errorData: {
      type: String,
      default: ""
    }
  }
};
</script>
