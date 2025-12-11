import {createRequestState, getRequestState, setRequestState} from "@/plugins/utils";
import {BigNumber} from "bignumber.js";
export const state = () => ({
  apiRequests: {
    getOrder: createRequestState(),
    getRoutes: createRequestState(),
  },
  info: null,
  load: true,
  errorData: "",
  order: {},
  verificationsStatus: {},
  favoriteRates: []
});

export const getters = {
  getRequestState,
  info: state => state.info,
  load: state => state.load,
  errorData: state => state.errorData,
  favoriteRates: state => state.favoriteRates,
  order: state => state.order,
  verificationsStatus: state => state.verificationsStatus
};

export const mutations = {
  setRequestState,
  info: (state, data) => (state.info = data),
  errorData: (state, error) => (state.errorData = error),
  load: (state, load) => (state.load = load),
  favoriteRates: (state, data) => (state.favoriteRates = data),
  order: (state, data) => (state.order = data),
  verificationsStatus: (state, verificationsStatus) => (state.verificationsStatus = verificationsStatus)
};
function divideStringByFirstSpace(str) {
  let firstSpaceIndex = str.indexOf(' ');
  if(firstSpaceIndex === -1) return [str, ''];
  let firstWord = str.slice(0, firstSpaceIndex);
  let restOfWords = str.slice(firstSpaceIndex + 1);
  return [firstWord, restOfWords];
}
export const actions = {
  async routes({commit, dispatch, state}) {

    if (state.apiRequests.getRoutes.isPending) {
      console.log("Routes already loading...");
      return;
    }
    if (process.browser) {
      commit("setRequestState", {getRoutes: "pending"});
      commit("load", false);
    }
    let apiRouteUrl = "GET:public/exchanger/route/get"
    if (this.app.$rest.config.newRouteV2Method) {
      apiRouteUrl = "GET:public/exchanger/route-v2/get"
    }
    const apiResult = await this.app.$rest
      .api(apiRouteUrl)
      .then(r => r.data)
      .catch(error => {
        commit("setRequestState", {getRoutes: "rejected"});

        return dispatch(
          "notify/add",
          {
            type: "plain",
            message: error.message,
            code: error.errorCode
          },
          {root: true}
        );
      });
    commit("load", true);
    commit("setRequestState", {getRoutes: "success"});
    if (apiResult && this.app.$rest.config.newRouteV2Method) {
      const routesIsShow = apiResult.routes.filter(element => element.isShowWeb === true)
        .map(el => {
          const currencyFrom = apiResult.currencies[el.from];
          if (!currencyFrom || !currencyFrom.isActive) return;
          const currencyTo = apiResult.currencies[el.to];
          if (!currencyTo || !currencyTo.isActive) return;
          const isCashFrom = currencyFrom.xml.indexOf("CASH") === 0
          const isCashTo = currencyTo.xml.indexOf("CASH") === 0
          let amount = Number(el.reserveAmountAdditional + currencyTo.reserveAmount);
          const decimalPlaces = amount < 1 ? 8 : amount < 10 ? 4 : amount < 100 ? 2 : amount < 100000 ? 0 : 0;
          amount = new BigNumber(amount).decimalPlaces(decimalPlaces, 1).toNumber(); //round down
          return {
            "from": {
              "name": isCashFrom ? divideStringByFirstSpace(currencyFrom.name)[0] : currencyFrom.name,
              "isCash": isCashFrom,
              "cityName": isCashFrom ? divideStringByFirstSpace(currencyFrom.name)[1] : "",
              "positionIn": currencyFrom.positionIn,
              "symbol": currencyFrom.symbol,
              "xml": currencyFrom.xml,
              "image": {files: [{type: "small", url: currencyFrom.image}]}
            },
            "to": {
              "name": isCashTo ? divideStringByFirstSpace(currencyTo.name)[0] : currencyTo.name,
              "cityName": isCashTo ? divideStringByFirstSpace(currencyTo.name)[1] : "",
              "isCash": isCashTo,
              "positionOut": currencyTo.positionOut,
              "symbol": currencyTo.symbol,
              "xml": currencyTo.xml,
              "image": {files: [{type: "small", url: currencyTo.image}]}
            },
            "rate": {
              "amount": amount,
            },
            "seo": {
              "friendlyURL": el.seoFriendlyURL
            },
            "routeId": el.routeId,
            "isShowWeb": el.isShowWeb,
          }
        }).filter(el => el);
      commit("info", routesIsShow);

      return routesIsShow;
    }
    if (apiResult) {
      let routesIsShow = apiResult.routes.filter(element => element.isShowWeb === true)
        .map(el => {
          const isCashFrom = el.from.xml.indexOf("CASH") === 0
          const isCashTo = el.to.xml.indexOf("CASH") === 0
          let amount = Number(el.rate.amount);
          const decimalPlaces = amount < 1 ? 8 : amount < 10 ? 4 : amount < 100 ? 2 : amount < 100000 ? 0 : 0;
          amount = new BigNumber(amount).decimalPlaces(decimalPlaces, 1).toNumber(); //round down
          return {
            "from": {
              "name": isCashFrom ? divideStringByFirstSpace(el.from.name)[0] : el.from.name,
              "isCash": isCashFrom,
              "cityName": isCashFrom ? divideStringByFirstSpace(el.from.name)[1] : "",
              "positionIn": el.from.positionIn,
              "symbol": el.from.symbol,
              "xml": el.from.xml,
              // "min": el.from.name,
              // "max": el.from.name,
              "image": el.from.image
            },
            "to": {
              "name": isCashTo ? divideStringByFirstSpace(el.to.name)[0] : el.to.name,
              "cityName": isCashTo ? divideStringByFirstSpace(el.to.name)[1] : "",
              "isCash": isCashTo,
              "positionOut": el.to.positionOut,
              "symbol": el.to.symbol,
              "xml": el.to.xml,
              "image": el.to.image
            },
            "rate": {
              "amount": amount,
            },
            "seo": {
              "friendlyURL": el.seo.friendlyURL
            },
            "routeId": el.routeId,
            "isShowWeb": el.isShowWeb,
          }
        });
      commit("info", routesIsShow);

      return routesIsShow;
    }
    return null;
  },

  async getBuyRouteCurrencyId({commit, dispatch},{id}) {

    const apiResult = await this.app.$rest
        .api("GET:public/exchanger/route/get", {
          fromCurrencyId: id,
        })
        .catch(err => {
          this.errorloadRouteGetOne = true;
          this.loadRouteGetOne = true;
          return Promise.reject(err);
        });

    if (apiResult) {
      return apiResult.data.routes;
    }
    return null;
  },

  async getSellRouteCurrencyId({commit, dispatch},{id}) {

    const apiResult = await this.app.$rest
        .api("GET:public/exchanger/route/get", {
          toCurrencyId: id,
        })
        .catch(err => {
          this.errorloadRouteGetOne = true;
          this.loadRouteGetOne = true;
          return Promise.reject(err);
        });

    if (apiResult) {
      return apiResult.data.routes;
    }
    return null;
  },

  async favRoutes({commit, dispatch}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("GET:public/exchanger/favorite/get")
      .then(r => r.data)
      .catch(error => {
        dispatch(
          "notify/add",
          {
            type: "error",
            message: error.message
          },
          {root: true}
        );
        return null;
      });
    commit("load", true);
    if (apiResult) {
      commit("favoriteRates", apiResult.rates);
    }
  },
  async createOrder({commit, dispatch}, {
    routeId,
    fromValues,
    toValues,
    routeValues,
    email,
    captcha,
    agreement,
    amount,
    lang,
    skipPreview,
    hideOutData,
    vuexActionV2
  }) {
    commit("load", false);
    const partner = localStorage.getItem("partner");
    const apiResult = await this.app.$rest
      .api("POST:public/exchanger/order/create", {
        routeId,
        fromValues,
        toValues,
        routeValues,
        email,
        captcha,
        agreement,
        amount,
        skipPreview,
        hideOutData,
        lang,
        partner: partner || undefined
      })
      .then(r => r.data)
      .catch(error => {
        if (!vuexActionV2) {
          return dispatch(
            "notify/add",
            {
              type: "error",
              message: error.message
            },
            {root: true}
          );
        }
        commit("load", true);
        return Promise.reject(error);
      });
    commit("load", true);
    if (apiResult) {
      return apiResult;
    }
    return false;
  },
  async getOrder({commit, dispatch}, {type, orderUID, orderSecret, vuexActionV2, disableLoaders}) {
    if (!disableLoaders) {
      commit("setRequestState", {getOrder: "pending"});
      commit("load", false);
    }
    const apiResult = await this.app.$rest
      .api("GET:public/exchanger/order/get", {
        type,
        orderUID,
        orderSecret
      })
      .then(r => r.data)
      .catch(error => {
        commit("setRequestState", {getOrder: "rejected"});
        if (!vuexActionV2) {
          dispatch(
            "notify/add",
            {
              type: "error",
              message: error.message
            },
            {root: true}
          );
          return null;
        }
        commit("load", true);
        return Promise.reject(error);
      });
    commit("load", true);

    if (apiResult) {
      commit("setRequestState", {getOrder: "success"});

      if (
        apiResult.order.route.from.paymentDetails &&
        apiResult.order.route.from.paymentDetails.merchant &&
        apiResult.order.route.from.paymentDetails.merchant.template
      )
        apiResult.order.route.from.paymentDetails.merchant.template = JSON.parse(
          apiResult.order.route.from.paymentDetails.merchant.template,
          function (key, value) {
            if (typeof value === "string" && value.startsWith("/Function(") && value.endsWith(")/")) {
              value = value.substring(10, value.length - 2);
              return eval("( function " + value + ")");
            }
            if (key === "type") {
              return eval(value);
            }
            return value;
          }
        );

      commit("verificationsStatus", apiResult.verifications || {});
      commit("order", apiResult.order);
    }
  },
  async changeOrder({commit, dispatch}, {orderUID, orderSecret, status}) {
    commit("load", false);
    await this.app.$rest
      .api("PUT:public/exchanger/order/update-status", {orderUID, orderSecret, status})
      .then(r => r.data)
      .catch(error => {
        dispatch(
          "notify/add",
          {
            type: "error",
            message: error.message
          },
          {root: true}
        );
        return null;
      });
    dispatch("getOrder", {orderSecret, orderUID});
  }
};
