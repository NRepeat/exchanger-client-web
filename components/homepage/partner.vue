<template>
  <div class="container container-dashed partner-block">
    <div v-if="partnersArray.length" class="our-partner">

      <ul>
        <li v-for="pa in partnersArray" :key="pa.id">
          <a :href="pa.link" target="_blank">
            <img :src="$rest.fsPath + pa.image.files.big.url" alt="" />

          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters({
      info: "partners/info"
    }),
    partnersArray() {
      return this.info.map(el => {
        let link = el.link;
        if ((this.$i18n.locale !== 'ru' && this.$i18n.locale !== 'ua') && link.indexOf("bestchange.ru")) {
          link = link.replace("bestchange.ru", "bestchange.com");
        }
        return {
          id: el.id,
          link: link,
          image: el.image,
        }
      })
    }
  },
  created() {
    this.getPartners({onlyReviewPartners: false});
  },
  methods: {
    ...mapActions({getPartners: "partners/getPartners"})
  }
};
</script>

<style scoped>
ul {
  padding: 23px 0px 20px 0px;
}
</style>
