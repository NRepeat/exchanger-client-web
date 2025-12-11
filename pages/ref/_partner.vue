<template>
  <div class="pelen">
    <loader />
    <div>Please wait...</div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  fetch(context) {
    setTimeout(() => {
      if (process.client) {
        console.log("Set partner to localStorage: ", context.params.partner);
        localStorage.setItem("partner", context.params.partner);
      }
      let {from, to, city} = {
        from: context.query.cur_from || context.query.from,
        to: context.query.cur_to || context.query.to,
        city: context.query.city,
      };
      return context.redirect(301, {
        path: context && context.i18n && context.i18n.localePath ? context.i18n.localePath(`/`) : "/",
        query: {
          from,
          to,
          city,
          ref: (!process.client) ? context.params.partner : undefined
        }
      });
    }, 700)
  },

};
</script>

<style scoped>
.pelen {
  width: 100%;
  /*height: 100vh;*/
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 35px;
  font-weight: bold;
}
</style>
