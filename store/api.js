export const state = () => ({
  data: false,
  load: true,
  block: false
});
export const getters = {
  data: state => state.data,
  load: state => state.load,
  block: state => state.block
};
export const mutations = {
  data: (state, data) => (state.data = data),
  load: (state, load) => (state.load = load),
  block: (state, block) => (state.block = block)
};
export const actions = {
  async getList({commit}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("GET:user/auth/api/get/list")
      .then(r => r.data)
      .catch(() => null);
    commit("load", true);
    if (apiResult) {
      commit("data", apiResult.keys);
    }
  },
  async create({commit, dispatch}, name) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/auth/api/create", {name})
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
      commit("block", apiResult.access);
      return dispatch("getList");
    }
    return false;
  },

  async remove({commit, dispatch}, apiKey) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("DELETE:user/auth/api/delete", {apiKey})
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
    if (apiResult) return dispatch("getList");
    return true;
  }
};
