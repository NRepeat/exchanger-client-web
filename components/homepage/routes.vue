<template>
  <div class="choose">
    <div class="container">
      <h4 class="title">{{ $t("page.about.choose") }}</h4>
      <ul>
        <li v-for="route in routes" :key="route.id">
          <a
            class="btn-submit"
            :href="
              onlySeo
                ? localePath(`/exchange/${route.seo.friendlyURL}`)
                : localePath(`/?from=${route.from.xml}&to=${route.to.xml}`)
            "
          >
            <p>
              <b>{{ $t("page.main.routes.text", { from: route.from.name+" "+route.from.cityName, to: route.to.name+" "+route.to.cityName }) }}  </b>
            </p>
            <span>{{ route.from.name }} {{ route.from.symbol }} - {{ route.to.name }} {{ route.to.symbol }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";

export default {
  props: {
    onlySeo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({routesInfo: "exchange/info"}),
    routes() {
      if (!this.routesInfo) return [];
      return this.routesInfo.filter(el => {
        if (!this.onlySeo) return true;
        return Boolean(el.seo.friendlyURL);
      });
    }
  },
  async created() {
    console.log("created component routes");
    await this.getRoutes();
  },
  methods: {
    ...mapActions({
      getRoutes: "exchange/routes"
    })
  }
};
</script>
