export const state = () => ({
  info: [],
  activeReviews: [],
  load: false,
  errorData: ""
});

export const getters = {
  info: state => state.info,
  load: state => state.load,
  activeReviews: state => state.activeReviews,
  errorData: state => state.errorData,
  current_page: state => state.current_page,
  total_page: state => state.total_page
};

export const mutations = {
  info: (state, data) => (state.info = data),
  activeReviews: (state, data) => (state.activeReviews = data),
  errorData: (state, error) => (state.error = error),
  load: (state, load) => (state.load = load),
  total_page: (state, pages) => (state.total_page = pages),
  current_page: (state, page) => (state.current_page = page)
};
export const actions = {
  getPartners({commit, dispatch}, param) {
    if(!param) param = {};
    commit("load", false);
    this.app.$rest.api("GET:public/partners-block/list", {onlyReviewPartners: param.onlyReviewPartners || undefined}).then(res => {
      commit("load", true);
      if (!res.success) {
        return dispatch("notify/add", {type: "error", message: res.error.message}, {root: true});
      }
      let activeReviews = {};

      for (let key in res.data.partners) {
        if (res.data.partners[key].isShowReviews === true) {
          activeReviews[key] = res.data.partners[key];
        }
      }
      commit("activeReviews", activeReviews);
      if (res.success) {
        commit("info", res.data.partners);
      }
    });
  }
};
