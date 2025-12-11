<template>
  <div v-if="!error" class="pelen">
    <loader />
    <div>Please wait...</div>
  </div>
  <div v-else class="pelen">
    <div>Error auth token is not valid try again.</div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data() {
    return {error: null};
  },
  methods: {
    ...mapActions({
      checkAuth: "user/checkAuth"
    })
  },
  mounted() {
    Promise.resolve()
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      })
      .then(() => {
        return this.$rest.api("POST:admin/users/profile/auth/token", {tmpAuthToken: this.$route.params.tmpAuthToken});
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
      .then(() => {
        return this.checkAuth();
      })
      .then(() => {
        return this.$router.push({path: this.localePath(`/user/profile/`)});
      })
      .catch(err => {
        console.error("Error Auth,", err);
      });
  }
};
</script>

<style scoped>
.pelen {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 35px;
  font-weight: bold;
}
</style>
