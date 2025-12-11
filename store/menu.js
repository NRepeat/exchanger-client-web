export const state = () => ({
  menu: false,
  user: false,
  buttons: []
});
export const getters = {
  menu: state => state.menu,
  user: state => state.user,
  buttons: state => state.buttons
};
export const mutations = {
  menu: (state, data) => (state.menu = data),
  user: (state, data) => (state.user = data),
  all: (state, data) => Object.keys(state).forEach(key => (key !== "buttons" ? (state[key] = data) : "")),
  buttons: (state, data) => (state.buttons = data)
};
export const actions = {
  async buttons({commit, dispatch}) {
    const apiResult = await this.app.$rest
      .api("GET:public/site/page/static/list")
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
    if (apiResult) commit("buttons", apiResult.pages);
  }
};
