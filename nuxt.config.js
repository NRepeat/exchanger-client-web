const {sitemap} = require("./plugins/sitemap");

const Sass = require("sass");

const config_creator = require("./plugins/config-creator");
const {getExcludeRoutes, generateRoutes} = require("./plugins/routeGenerator");
const langConfigArray = require("./lang.config.js");
const robotsConfig = require("./robots.config.js");

const config = config_creator.get();
let proxyConfig = {};
if (!config.__proxy_path) config.__proxy_path = "/service";
const pxp = config.__proxy_path + "/";
proxyConfig[pxp] = {
  target: config.__proxy_to_rest_api,
  pathRewrite: {}
};
proxyConfig[pxp].pathRewrite["^" + pxp] = "/";
const robotsExpressions = robotsConfig.Disallow.map(el => new RegExp("^" + el.replace("*", "[a-zA-Z0-9]{2,3}") + "+"));

module.exports = {
  telemetry: false,
  target: process.env.NUXT_TARGET || config_creator.get("targetBuild") || "static",
  server: {
    port: process.env.NUXT_PORT || config_creator.get("server:dev:port"),
    host: process.env.NUXT_HOST || config_creator.get("server:dev:host")
  },
  router: {
    trailingSlash: true
  },
  generate: {
    dir: "dist/client",
    routes: async () => generateRoutes(),
    concurrency: 100,
    interval: 40,
    exclude: [/^(?=.*\buser\b).*$/]
  },
  ssr: config_creator.get("buildSSR") || false,
  head: {
    titleTemplate: `%s - ${config_creator.get("projectName")}`,
    meta: [{charset: "utf-8"}, {name: "viewport", content: "width=device-width, initial-scale=1"}],
    link: [{rel: "icon", type: "image/x-icon", href: config_creator.get("faviconPath")}]
  },
  loading: {
    color: "#006cf0",
    height: "5px"
  },
  css: [
    "~/assets/sass/style.scss"
  ],
  modules: [
    ["@nuxtjs/proxy", {logLevel: 'info'}],
    "@nuxtjs/i18n",
    "~/node_fixed_modules/nuxt-seo",
    ["nuxt-validate"],
    ["nuxt-clipboard2"],
    ["cookie-universal-nuxt", {alias: "cookiz", parseJSON: false}],
    ["vue-sweetalert2/nuxt"],
    ["@nuxtjs/moment", {locales: langConfigArray.map(el => el.moment), defaultLocale: "en-gb"}],
    [
      "@nuxtjs/pwa",
      {
        meta: {name: config.projectName, description: config.projectName},
        manifest: {name: config.projectName, theme_color: "#121621"},
        icon: {iconSrc: config_creator.get("faviconPath"), sizes: [16, 32, 96, 192], type: "image/png"}
      }
    ],
    "@nuxtjs/axios",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap"
  ],
  seo: {
    baseUrl: config_creator.get("baseUrl"),
    canonical: 'auto', // function createCanonicalis must be return [] in node_modules/nuxt-seo/lib/module.js:233
    lang: false,
    language: false,
    isForcedTrailingSlash: true
  },
  i18n: {
    strategy: config_creator.get("i18nStrategy") || "prefix",
    parsePages: false,
    lazy: true,
    baseUrl: config_creator.get("baseUrl"),
    defaultLocale: config_creator.get("defaultLang"),
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      alwaysRedirect: Boolean(config_creator.get("i18nStrategy") === "prefix"),
      fallbackLocale: config_creator.get("defaultLang"),
      redirectOn: 'root'
    },
    locales: langConfigArray.map(el => ({
      name: el.name,
      symbol: el.symbol,
      code: el.code,
      iso: el.iso,
      file: el.file
    })),
    langDir: "~/locales/",
    // rootRedirect: config_creator.get("defaultLang") + "/",
    // detectBrowserLanguage: false,
  },
  robots: {
    UserAgent: "*",
    CrawlDelay: "1",
    Host: config.baseUrl, //.split("://")[1],
    Sitemap: config.baseUrl + "/sitemap.xml",
    Disallow: robotsConfig.Disallow
  },
  sitemap: {
    hostname: config.baseUrl,
    gzip: true,

    trailingSlash: true,
    defaults: {
      changefreq: "weekly",
      priority: 0.5,
      lastmod: new Date()
    },
    exclude: getExcludeRoutes(),
    routes: async () => {
      const friendlyExchange = await generateRoutes(true);
      if (!friendlyExchange) return sitemap;
      friendlyExchange.forEach(el => {
        sitemap.push({url: el, changefreq: "always", priority: 0.9});
      });
      return sitemap;
    },
    filter({routes}) {
      return routes.filter(route => {
        return robotsExpressions.findIndex(regExp => regExp.test(route.path)) === -1
      })
    },
    i18n: {
      defaultLocale: config_creator.get("defaultLang"),
      locales: langConfigArray.map(el => el.code),
      routesNameSeparator: "___"
    }
  },
  plugins: [
    {src: "~/plugins/loader.js"},
    {src: "~/plugins/rest-api.js"},
    {src: "~/plugins/QrcodeVue.js"},
    {src: "~/plugins/v-runtime.js", ssr: false}
  ],
  axios: {
    proxy: true
  },
  proxy: proxyConfig,
  env: {
    config: config
  },

  build: {
    loaders: {
      scss: {
        implementation: Sass,
        // fiber: Fiber
      }
    },
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  }
};
