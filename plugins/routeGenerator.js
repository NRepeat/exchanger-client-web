const axios = require("axios");
const config_creator = require("./config-creator");
const config = config_creator.get();
let proxyConfig = {};
if (!config.__proxy_path) config.__proxy_path = "/service";
const pxp = config.__proxy_path + "/";
proxyConfig[pxp] = {
  target: config.__proxy_to_rest_api,
  pathRewrite: {}
};
proxyConfig[pxp].pathRewrite["^" + pxp] = "/";
const langConfigArray = require("./../lang.config.js");

const avaliableLangs = langConfigArray.map(el => el.code);
let excludeRoutes = ["/user/**", "/error/**", "/success/**", "/auth/**", "/user", "/error", "/success", "/auth"];

const getExcludeRoutes = () => {
  let excludeRoutesWithLangs = [];
  // push langs prefix to url
  avaliableLangs.forEach(lang => excludeRoutes.forEach(route => excludeRoutesWithLangs.push(`/${lang}${route}`)));
  return [...excludeRoutesWithLangs, ...excludeRoutes];
};

let generateRoutes = async withoutLangsPrefix => {
  if (config.buildSSR === false) return [];
  const apiUrlThrowProxy = (config.__proxy_to_rest_api + config.apiPath.replace(config.__proxy_path, ""))
    .replace("//api", "/api")
    .replace("/v1//", "/v1/");
  let [exchangeRoutes, newsRoutes, rulesRoutes, staticPages] = await Promise.all([
    axios
      .get(apiUrlThrowProxy + "public/exchanger/route/get")
      .then(res => res.data)
      .then(r => {
        if (r.data) {
          return r.data;
        }
        if (r.error) {
          console.error("[Warn] Routes isn't generate: ", r.error.errorCode, r.error.message);
          return {routes: []};
        }
        console.error("[Error] Routes isn't generate: (invalid response)", r);
        return {routes: []};
      })
      .then(r => r.routes)
      .catch(err => {
        console.error("NUXT config generate seo->", apiUrlThrowProxy + "public/exchanger/route/get", err);
        return [];
      }),
    axios
      .post(apiUrlThrowProxy + "public/news/list/full")
      .then(res => res.data)
      .then(r => {
        if (r.data) {
          return r.data;
        }
        if (r.error) {
          console.error("[Warn] News isn't generate: ", r.error.errorCode, r.error.message);
          return {news: []};
        }
        console.error("[Error] News isn't generate: (invalid response)", r);
        return {news: []};
      })
      .then(r => r.news)
      .catch(err => {
        console.error("NUXT config generate seo->", apiUrlThrowProxy + "public/news/list/full", err);
        return [];
      }),
    axios
      .post(apiUrlThrowProxy + "public/rule/list")
      .then(res => res.data)
      .then(r => {
        if (r.data) {
          return r.data;
        }
        if (r.error) {
          console.error("[Warn] rules isn't generate: ", r.error.errorCode, r.error.message);
          return {rules: []};
        }
        console.error("[Error] rules isn't generate: (invalid response)", r);
        return {rules: []};
      })
      .then(r => r.rules)
      .catch(err => {
        console.error("NUXT config generate seo->", apiUrlThrowProxy + "public/rule/list", err);
        return [];
      }),
    axios
      .post(apiUrlThrowProxy + "public/site/page/static/list")
      .then(res => res.data)
      .then(r => {
        if (r.data) {
          return r.data;
        }
        if (r.error) {
          console.error("[Warn] rules isn't generate: ", r.error.errorCode, r.error.message);
          return {pages: []};
        }
        console.error("[Error] rules isn't generate: (invalid response)", r);
        return {pages: []};
      })
      .then(r => r.pages)
      .catch(err => {
        console.error("NUXT config generate seo->", apiUrlThrowProxy + "public/rule/list", err);
        return [];
      })
  ]);
  if (!exchangeRoutes) exchangeRoutes = [];
  if (!newsRoutes) newsRoutes = [];
  if (!rulesRoutes) rulesRoutes = [];
  if (!staticPages) staticPages = [];
  let routesIsShow = exchangeRoutes
    .filter(element => element.isShowWeb === true)
    .filter(el => {
      return el && el.seo && el.seo.friendlyURL;
    });
  if (!routesIsShow) routesIsShow = [];
  let exchanges = routesIsShow.map(route => {
    return `/exchange/${route.seo.friendlyURL}/`;
  });
  let newsRulesStatic = [
    ...newsRoutes.map(el => `/${el.lang.replace('ua', 'uk')}/news/${el.link}/`),
    ...rulesRoutes.map(el => `/${el.lang.replace('ua', 'uk')}/rules/${el.link}/`),
    ...staticPages.map(el => `/${el.lang.replace('ua', 'uk')}/${el.link}/`),
  ];
  newsRulesStatic = newsRulesStatic.map(url => url.replace((config.i18nStrategy === "prefix_except_default") ? `/${config.defaultLang}` : "", ""));

  let results = [...exchanges, ...newsRulesStatic];
  if (withoutLangsPrefix) {
    return results;
  }
  for (let key in avaliableLangs) {
    results.push(...exchanges.map(pathUrl => {
      return String(`/${avaliableLangs[key]}${pathUrl}`).replace((config.i18nStrategy === "prefix_except_default") ? `/${config.defaultLang}` : "", "");
    }));
  }
  return results;
};
module.exports = {excludeRoutes, getExcludeRoutes, generateRoutes};
