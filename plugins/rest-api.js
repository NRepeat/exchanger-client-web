import Vue from "vue";
import axios from "axios";
import VueEvents from "vue-events";

const ignoreCodes = [40301, 5555555555555555, 2361520890494288];

Vue.use(VueEvents);

const config = require("../config/app");
/**
 * @typedef apiResult
 * @property success {bool} - true if the api response is success.
 * @property requestId {string} -  id of request.
 * @property latency_ms {integer} -  latency server ms for this call.
 * @property error {Object} -  error object.
 * @property data {Object.<*>} -  response data.
 */
export default ({store, app}) => {
  const errorMessage = app.i18n.t("errorMessage");
  const Rest = {
    install(Vue) {
      Vue.prototype.$rest = this;
    },
    technical_work: store.state.params.technical_work,
    ws: {
      readyState: 0,
      request: async () => Promise.reject("Error send (websocket init)")
    },
    /**
     * @param method
     * @param param
     * @return {Promise<apiResult>}
     */
    api(method, param) {
      method = method.split(':');
      let typeMethod = 'POST';
      if (method.length === 2) {
        typeMethod = method[0];
        method = method[1];
      } else {
        method = method[0];
      }
      typeMethod = typeMethod.toUpperCase();
      let API_URL = config.baseUrl + config.apiPath + method + "/";
      if (process.server) {
        API_URL = (config.__proxy_to_rest_api + config.apiPath + method + "/")
          .replace(config.__proxy_path, "");
      }
      const headers = {
        Lang: app.i18n.locale,
        "Content-Type": "application/json",
      };
      if (process.browser && (typeMethod === "POST" || typeMethod === "PUT" || typeMethod === "DELETE")) {
        headers["Csrf-Token"] = app.$cookiz.get("_csrf");
      }
      return app.$axios({
        method: typeMethod,
        url: API_URL,
        [typeMethod === "GET" ? 'params' : "data"]: param,
        headers: headers
      })
        .then(res => res.data)
        .then(res => {
          if (res.success === false) {
            return Promise.reject(res.error);
          }
          return res;
        })
        .catch(err => {
          if (!ignoreCodes.some(el => el === err.errorCode)) {
            console.error("API Error ->", process.server ? "server" : "client", API_URL, "Params->", param || {}, ":", err.message);
          }
          if (err.errorCode === 5555555555555555) {
            store.commit("params/setWorkStatus", true);
          }

          if (errorMessage && errorMessage[err.errorCode]) {
            err.message = app.i18n.t("errorMessage." + err.errorCode, err.object);
          }
          if (err.errorCode === 6231546409213868) {
            err.message = app.i18n.t("text-field") + (err.object.nameField || "").toLowerCase() + app.i18n.t("not-filled");
          }
          return Promise.reject(err);
        });
    },
    unpackImg(arr) {
      console.warn("deprecated use urlImg");
      return arr.reduce((obj, el) => {
        obj[el.type] = el;
        return obj;
      }, {});
    },
    urlImg(arr) {
      if (arr.files) {
        arr = arr.files;
      }
      return arr.reduce((obj, el) => {
        obj[el.type] = config.baseUrl + config.fsPath + el.url;
        return obj;
      }, {});
    },
    wsUrl: config.wsUrl,
    baseUrl: config.baseUrl,
    logoPath: config.logoPath,
    faviconPath: config.faviconPath,
    apiPath: config.baseUrl + config.apiPath,
    fsPath: config.baseUrl + config.fsPath,
    servicePath: config.baseUrl + config.servicePath,
    projectName: config.projectName,
    config: config
  };
  const openWS = () => {
    if (process.server) {
      return null;
    }
    if (!config.wsUrl || (['disable', 'ws://', 'wss://', 'false', 'off']).indexOf(config.wsUrl) !== -1)
      return null;

    Rest.ws = new WebSocket(config.wsUrl);
    Rest.ws.onopen = () => {
      Vue.prototype.$events.$emit("ws/connect");
    };
    Rest.ws.request = async (method, data) => {
      if (Rest.ws.readyState === 1) {
        Rest.ws.send(JSON.stringify({method, data}));
      } else {
        console.error("WebSocket is not connected!");
        return Promise.reject("Error send (socket closed)");
      }
    };
    Rest.ws.onclose = event => {
      if (!event.wasClean) {
        console.error("WS close connection ERROR!");
        console.error("CODE: " + event.code + " READON: " + event.reason);
      }

      setTimeout(() => {
        openWS();
      }, 1000);
    };
    Rest.ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.method) {
          Vue.prototype.$events.$emit("ws/emit/" + data.method, data.data);
        } else {
          console.warn("WS onmessage error format data:", data);
        }
      } catch (e) {
        console.error("WS error parse message", e);
      }
    };
    Rest.ws.onerror = error => console.error("[ws] error: " + error.message);
  };
  openWS();

  Vue.use(Rest);
  app.$rest = Rest;
};
