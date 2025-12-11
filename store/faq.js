export const state = () => ({
  faq: [{}, {}, {}, {}, {}],
  langs: null,
  groups: null,
  oneFaq: {},
  load: true,
  isActive: false,
  errorData: "",
  total_pages: 1,
  current_page: 1
});

export const getters = {
  getData: state => state.faq,
  getLangs: state => state.langs,
  getGroups: state => state.groups,
  getOneFaq: state => state.oneFaq,
  getLoad: state => state.load,
  getError: state => state.errorData,
  getCurrentPage: state => state.current_page,
  getTotalPages: state => state.total_pages
};

export const mutations = {
  changeFaq: (state, data) => (state.faq = data),
  changeError: (state, error) => (state.errorData = error),
  changeOneFaq: (state, faq) => (state.oneFaq = faq),
  changeLangs: (state, langs) => (state.langs = langs),
  changeGroups: (state, groups) => (state.groups = groups),
  changeLoad: (state, load) => (state.load = load),
  changeTotalPages: (state, pages) => (state.total_pages = pages),
  changeCurrentPage: (state, page) => (state.current_page = page)
};

export const actions = {
  async getLangsGroups({commit, state}) {
    if (!state.groups || !state.langs) {
      const groupPromise = this.app.$rest
        .api("GET:public/faq/get/group")
        .then(r => r.data)
        .then(r => r.faqGroups);
      const langsPromise = this.app.$rest
        .api("GET:public/server/lang/all")
        .then(r => r.data)
        .then(r => r.lang);
      const [faqGroups, lang] = await Promise.all([groupPromise, langsPromise]);
      commit("changeLoad", true);

      if (faqGroups) {
        commit("changeGroups", faqGroups);
      }
      if (lang) {
        commit("changeLangs", lang);
      }
    }
  },
  async getFaqFull({commit, dispatch}, obj) {
    commit("changeLoad", false);
    dispatch("getLangsGroups");
    const apiResult = await this.app.$rest
      .api("GET:public/faq/get/list", obj)
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
      commit("changeFaq", apiResult.faq);
      commit("changeCurrentPage", apiResult.count.select_page || 1);
      commit("changeTotalPages", apiResult.count.pages || 1);
    }
  },
  async getOneFaq({commit, dispatch}, id) {
    commit("changeLoad", false);
    dispatch("getLangsGroups");
    const apiResult = await this.app.$rest
      .api("GET:public/faq/get/one", {id})
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
      commit("changeOneFaq", apiResult);
    }
  }
};
