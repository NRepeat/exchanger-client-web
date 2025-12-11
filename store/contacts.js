export const state = () => ({
  info: [],
  load: false,
  errorData: ""
});

export const mutations = {
  changeData(state, data) {
    state.info = data;
  },
  changeError(state, error) {
    state.error = error;
  },
  changeLoad(state, load) {
    state.load = load;
  }
};

export const actions = {
  async getContacts({commit, dispatch}, lang) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:public/contacts/list", {
        lang: lang,
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

    if (apiResult) commit("changeData", apiResult.contacts);
  }
};
export const getters = {
  getData(state) {
    return state.info;
  },
  getLoad(state) {
    return state.load;
  },
  getError(state) {
    return state.errorData;
  }
};
