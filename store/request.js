const typeStatusToArray = {
  current: ["new", "waitPayment", "inProgress", "errorPayout", "inProgressPayout", "hold", "errorPayment"],
  deleted: ["deleted", "returned"],
  done: ["done"],
  all: undefined
};
export const state = () => ({
  history: [],
  load: true,
  block: false,
  total_pages: 1,
  current_page: 1,
  status: {
    deleted: {color: "red"},
    done: {color: "green"},
    errorPayment: {color: "red"},
    errorPayout: {color: "red"},
    hold: {color: "blue"},
    inProgress: {color: "#1af"},
    inProgressPayout: {color: "grey"},
    new: {color: "gold"},
    returned: {color: "cyan"},
    waitPayment: {color: "green"}
  }
});
export const getters = {
  history: state => state.history,
  load: state => state.load,
  status: state => state.status,
  block: state => state.block,
  getCurrentPage: state => state.current_page,
  getTotalPages: state => state.total_pages,
};
export const mutations = {
  history: (state, history) => (state.history = history),
  load: (state, load) => (state.load = load),
  block: (state, block) => (state.block = block),
  changeTotalPages: (state, pages) => (state.total_pages = pages),
  changeCurrentPage: (state, page) => (state.current_page = page)
};
export const actions = {
  async getList({commit, dispatch}, data) {
    if (!data) data = {};

    let {status, page, limit} = data;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    let statuses = undefined;
    if (typeStatusToArray[status]) {
      statuses = typeStatusToArray[status]; // group statuses by  type
    }

    commit("load", false);
    const apiResult = await this.app.$rest
      .api("GET:user/exchanger/order/history", {statuses, page, limit})
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
      commit("changeCurrentPage", apiResult.count.select_page || 1);
      commit("changeTotalPages", apiResult.count.pages || 1);
      return apiResult;
    }
  }
};
