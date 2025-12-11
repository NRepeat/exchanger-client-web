export const state = () => ({
  partnerOrder: {},
  partnerRoutes: [],
  load: true,
  errorData: ""
});
export const getters = {
  getDataPartnerRoutes: state => state.partnerRoutes,
  getLoad: state => state.load,
  getErrorData: state => state.errorData,
  getPartnerOrder: state => state.partnerOrder
};

export const mutations = {
  changePartnerRoutes: (state, data) => (state.partnerRoutes = data),
  changePartnerOrder: (state, data) => (state.partnerOrder = data),
  changeErrorData: (state, error) => (state.errorData = error),
  changeLoad: (state, load) => (state.load = load)
};

export const actions = {
  async getPartnerRoutes({commit, dispatch}) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:user/exchanger/partner-route/get")
      .then(r => r.data)
      .catch(error => {
        return dispatch(
          "notify/add",
          {
            type: "plain",
            message: error.message,
            code: error.statusCode
          },
          {root: true}
        );
      });
    commit("changeLoad", true);
    commit("changePartnerRoutes", apiResult.routes);
  },

  async createPartnerOrder({commit}, {routeId, toValues, routeValues, agreement, amount}) {
    const apiResult = await this.app.$rest
      .api("POST:user/exchanger/order/partner/create", {routeId, toValues, routeValues, agreement, amount})
      .then(r => r.data)
      .catch(error => {
        commit("changeLoad", true);
        return Promise.reject(error);
      });
    commit("changeLoad", true);
    return apiResult;
  },

  async getPartnerOrder({commit, dispatch}, {orderUID, orderSecret}) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:user/exchanger/order/partner/get", {
        orderUID,
        orderSecret
      })
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
    commit("changeLoad", true);
    if (apiResult) {
      commit("changePartnerOrder", apiResult.order);
    }
  }
};
