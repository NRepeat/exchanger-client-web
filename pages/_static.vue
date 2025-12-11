<template>
  <div>
    <div class=" specification-top-wr">
      <div class="container">
        <div class="about-us-top">
          <h1>{{ title }}</h1>
        </div>
      </div>
    </div>
    <div class="container">
      <transition name="faded">
		<div class="specification-info">
			<div class="item-page" v-if="load && serverRender" v-html="temp" />
			<v-runtime-template class="item-page" v-else-if="load" :template="temp" />
			<loader v-else />
		</div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: "staticPage",
  head() {
    const {meta, title} = this.$seo({
      title: this.seo.title || this.title,
      description: this.seo.description || this.temp.replace(/(<([^>]+)>)/ig, "").slice(0,250),
      keywords: this.seo.keyword || "",
      openGraph: {
        title: this.seo.title || this.title,
        description:  this.seo.description || this.temp.replace(/(<([^>]+)>)/ig, "").slice(0,250),
        image: {url: this.$rest.baseUrl + this.$rest.faviconPath, width: 100, height: 100, type: 'image/png'}
      }
    });
    return {meta, title};
  },
  components: {
    routes: () => import("~/components/homepage/routes").then(comp => comp),
    reviews: () => import("~/components/homepage/reviews").then(comp => comp),
    reserves: () => import("~/components/homepage/reserves").then(comp => comp),
    partners: () => import("~/components/homepage/partner").then(comp => comp),
    news: () => import("~/components/news/list").then(comp => comp),
    exchange: () => import("~/components/homepage/exchangeForms/v2").then(comp => comp)
  },
  data() {
    return {
      temp: "",
      title: "",
      load: false,
      serverRender: false,
      seo: {}
    };
  },
  asyncData({params, app, error}) {
    return app.$rest
      .api("GET:public/site/page/static/content", {
        lang: app.i18n.locale,
        link: params.static
      })
      .then(r => {
        r.data.html = r.data.html.replace(/<!/g, "<");
        r.data.html = r.data.html.replace(/!>/g, ">");
        r.data.html = r.data.html.replace(/{<{/g, "<");
        r.data.html = r.data.html.replace(/}>}/g, ">");
        return r.data;
      })
      .catch(() => {
        return null;
      })
      .then(res => {
        if (!res) return error({statusCode: 404, message: app.i18n.t("page.404.title")});
        return {
          title: (res && res.title) || "Error",
          temp: (res && res.html) || "",
          seo: res.seo || {},
          load: true,
          serverRender: false, // process.server
        };
      });
  }
};
</script>
<style scoped>
.container h2 {
  font-size: 24px;
  font-weight: 600;
  padding: 18px 0;
}

.container h2 {
  font-size: 22px;
  font-weight: 600;
  padding: 15px 0;
}

.container h3 {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 0;
}

.container ul, .container ol {
  padding: inherit;
  list-style: inherit;
}
</style>
