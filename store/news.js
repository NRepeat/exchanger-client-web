export const state = () => ({
  news: [{}, {}, {}, {}, {}, {}],
  oneNews: {},
  langs: [],
  groups: null,
  isActive: false,
  load: true,
  errorData: {},
  total_pages: 1,
  current_page: 1
});
export const getters = {
  getData: state => state.news,
  getOneNews: state => state.oneNews,
  getLangs: state => state.langs,
  getLoad: state => state.load,
  getError: state => state.errorData,
  getCurrentPage: state => state.current_page,
  getTotalPages: state => state.total_pages
};

export const mutations = {
  changeData: (state, data) => (state.news = data),
  changeError: (state, error) => (state.errorData = error),
  changeOneNews: (state, news) => (state.oneNews = news),
  changeLangs: (state, langs) => (state.langs = langs),
  changeLoad: (state, load) => (state.load = load),
  changeTotalPages: (state, pages) => (state.total_pages = pages),
  changeCurrentPage: (state, page) => (state.current_page = page)
};

export const actions = {
  async getNewsFull({commit, dispatch}, filter) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:public/news/list/full", filter)
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
      commit("changeData", apiResult.news);
      commit("changeCurrentPage", apiResult.count.select_page || 1);
      commit("changeTotalPages", apiResult.count.pages || 1);
    }
  },
  async getOneNews({commit}, {link, lang, id}) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:public/news/get/one", {link, lang, id})
      .then(r => r.data)
      .catch(() => {
        return null;
      });
    commit("changeLoad", true);
    commit("changeOneNews", apiResult);

    return Boolean(apiResult);
  },
  async createComment({commit, dispatch}, {news_id, message, name_author}) {
    commit("changeLoad", false);
    let apiResult = await this.app.$rest
      .api("POST:user/news/comment/create", {
        news_id,
        message,
        name_author
      })
      .then(r => r.data)
      .catch((err) => {
        this.$swal("", err.message, "error");
        return null;
      });
    commit("changeLoad", true);
    if (apiResult)
      dispatch("getOneNews", {id: news_id});
    return Boolean(apiResult);
  }
};
