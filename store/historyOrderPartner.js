export const state = () => ({
  history: false,
  load: true,
  block: false,
  total_pages: 1,
  current_page: 1,
  status: {
    deleted: {color: "red"},
    done: {color: "green"},
    errorPayment: {color: "red"},
    new: {color: "gold"},
    returned: {color: "cyan"}
  }
});
export const getters = {
  history: state => state.history,
  load: state => state.load,
  status: state => state.status,
  block: state => state.block,
  getCurrentPage: state => state.current_page,
  getTotalPages: state => state.total_pages
};
export const mutations = {
  history: (state, history) => (state.history = history),
  load: (state, load) => (state.load = load),
  block: (state, block) => (state.block = block),
  changeTotalPages: (state, pages) => (state.total_pages = pages),
  changeCurrentPage: (state, page) => (state.current_page = page)
};
export const actions = {
  async getListPartnerOrder({commit, dispatch}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("GET:user/exchanger/order/partner/history")
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
      commit("history", apiResult.orders);
      commit("changeCurrentPage", apiResult.select_page || 1);
      commit("changeTotalPages", apiResult.count.pages || 1);
      return apiResult;
    }
  }
};
