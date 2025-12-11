export const state = () => ({
  webAlerts: [],
  load: false
});

export const getters = {
  webAlerts: state => state.webAlerts,
  load: state => state.load
};

export const mutations = {
  webAlerts: (state, data) => (state.webAlerts = data),
  load: (state, load) => (state.load = load)
};
export const actions = {
  async getList({commit}, data) {
    commit("load", false);
    let res = await this.app.$rest
      .api("GET:public/web-alerts/get/list", data)
      .then(res => {
        return res.data.webAlerts;
      })
      .catch(() => false);
    if (res) commit("webAlerts", res);
    commit("load", true);
  }
};
