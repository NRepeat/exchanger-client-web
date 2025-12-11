export const state = () => ({
  rules: [],
  rule: {},
  langs: false,
  isActive: false,
  load: false,
  errorData: "",
  total_pages: 1,
  current_page: 1
});

export const getters = {
  getData: state => state.rules,
  getRule: state => state.rule,
  getLangs: state => state.langs,
  getLoad: state => state.load,
  getError: state => state.errorData,
  getCurrentPage: state => state.current_page,
  getTotalPages: state => state.total_pages
};

export const mutations = {
  changeData: (state, data) => (state.rules = data),
  changeError: (state, error) => (state.errorData = error),
  changeRule: (state, news) => (state.rule = news),
  changeLangs: (state, langs) => (state.langs = langs),
  changeLoad: (state, load) => (state.load = load),
  changeTotalPages: (state, pages) => (state.total_pages = pages),
  changeCurrentPage: (state, page) => (state.current_page = page)
};

export const actions = {
  async getLangs({commit, dispatch, state}) {
    if (!state.langs) {
      const apiResult = await this.app.$rest
        .api("GET:public/server/lang/all")
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
      if (apiResult) {
        commit("changeLangs", apiResult.lang);
      }
    }
  },
  async getTitleRules({commit, dispatch}, filter) {
    commit("changeLoad", false);
    const apiResult = await this.app.$rest
      .api("GET:public/rule/list", filter)
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
      commit("changeData", apiResult.rules);
      commit("changeCurrentPage", apiResult.count.select_page || 1);
      commit("changeTotalPages", apiResult.count.pages || 1);
      return apiResult.rules;
    }
  },
  async getRule({commit, dispatch}, data) {
    commit("changeLoad", false);
    let {link, lang} = data;
    const apiResult = await this.app.$rest
      .api("GET:public/rule/get", {link, lang})
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
      apiResult.rule.stripedContent = apiResult.rule.content.replace(/<\/?[^>]+>/gi, " ")
      commit("changeRule", apiResult.rule);
    }
  }
};
