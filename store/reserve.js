export const state = () => ({
  info: [],
  errorData: "",
  load: false
});
export const getters = {
  getData: state => state.info,
  getLoad: state => state.load,
  getError: state => state.errorData
};

export const mutations = {
  changeData: (state, data) => (state.info = data),
  changeError: (state, error) => (state.error = error),
  changeLoad: (state, load) => (state.load = load)
};

export const actions = {
  async getReserve({commit, dispatch}) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .to("admin/exchanger/currency/get/reserves")
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
      commit("changeData", apiResult.currencies);
      return apiResult;
    }
  }
};
