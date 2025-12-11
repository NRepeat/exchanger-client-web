<template>
  <tr>
    <td>
      <div class="key">
        <img src="~assets/img/key.svg" alt="img" />
        {{ data.key }}
      </div>
    </td>
    <td>
      <span>{{ $moment(data.createdAt).format("DD MMM YYYY HH:mm") }}</span>
    </td>
    <td>
      <button class="btn" @click="load && remove()">
        <img v-if="load" src="~assets/img/delet.svg" alt="img" />
        <loader v-else :responsive="true" width="30" height="30" />
      </button>
    </td>
  </tr>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      load: true
    };
  },
  methods: {
    async remove() {
      this.load = false;
      await this.$store.dispatch("api/remove", this.data.key);
      this.load = true;
    }
  }
};
</script>
