<template>
  <div class="specification-top-wr">
    <div class="container">
      <div class="specification-top">
        <h1>{{ $t("page.rules.title") }}</h1>
        <div class="specification-top-item">
          <ul>
            <li v-for="title in titles" v-if="title.lang === $root.$i18n.locale" :key="title._id">
              <button class="btn btn-blue" @click="$emit('onChangeRule', title.link)">
                {{ title.title }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  computed: {
    ...mapGetters("rules", {
      titles: "getData",
      rules: "getRule",
      total_pages: "getTotalPages",
      current_page: "getCurrentPage",
      load: "getLoad"
    }),
    lang() {
      return this.$root.$i18n.locale;
    }
  },
  created() {
    this.getTitleRules({lang: this.lang});
  },
  methods: {
    ...mapActions("rules", {
      getTitleRules: "getTitleRules",
      getRule: "getRule"
    })
  }
};
</script>
