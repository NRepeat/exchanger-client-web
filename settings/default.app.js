"use strict";
module.exports = config => {
  config.default("defaultLang", "en");
  config.default("i18nStrategy", "prefix"); // https://i18n.nuxtjs.org/strategies/
  config.default("targetBuild", "static"); // https://v2.nuxt.com/docs/configuration-glossary/configuration-target/
  config.default("buildSSR", false);
  config.default("baseUrl", "http://localhost:8080");
  config.default("wsUrl", "ws://");
  config.default("projectName", "Exchanger");

  config.default("server:dev:port", 8080);
  config.default("server:dev:host", "localhost");
  config.default("__proxy_path", "/service");
  config.default("__proxy_to_rest_api", "http://localhost:3010");
  config.default("servicePath", "/service");
  config.default("fsPath", "/service/fs");
  config.default("apiPath", "/service/api/v1/");
  config.default("logoPath", "/service/fs/img/logo/big/logo.png");
  config.default("faviconPath", "/service/fs/img/favicon/512/favicon.png");

  // config.default("newRouteV2Method", true);
  config.default("styles:exchangeForm", "v2"); // v1 - select options, v2 - list, v3 - inputs
  config.default("eslint:status", false);

  config.save();
};
