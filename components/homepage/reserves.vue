<template>
  <div class="reserves">
    <div class="container">
      <h3 class="title">
        {{ $t("page.main.reserves.title") }}
        <a href="#all" class="btn btn-look" style="display: none;">{{ $t("page.main.reserves.all") }}</a>
      </h3>
      <ul v-if="info">
        <li v-for="res in toList" :key="res._id">
          <div class="reserves-icon">
            <img :src="$rest.urlImg(res.to.image.files).small" alt="" />
            <span>{{ res.to.name + (res.to.cityName ? " " + res.to.cityName : "") }}</span>
          </div>
          <div class="reserves-cost">
            <p>{{ res.rate.amount }} {{ res.to.symbol }}</p>

            <p v-if="false" class="order-reserves">
              <a href="#" class="btn btn-look order-reserves-btn">{{ $t("page.main.reserves.order") }}</a>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters("exchange", ["info"]),
    toList() {
      let obj = {};
      return this.info
        .filter(el => {
          if (obj[el.to.xml]) {
            return false;
          } else {
            obj[el.to.xml] = true;
            return true;
          }
        })
        .sort((a, b) => (a.rate.amount < b.rate.amount ? 1 : -1));
    }
  },
  created() {
    if (!this.info) {
      return this.routes();
    }
    return null;
  },
  methods: {
    ...mapActions({
      routes: "exchange/routes"
    })
  }
};
</script>
