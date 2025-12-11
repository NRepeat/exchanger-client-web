export const state = () => ({
  notifies: [],
  timeout: 5000,
  backup: []
});
export const getters = {
  notifies: state => state.notifies,
  timeout: state => state.timeout,
  backup: state => state.backup
};
export const mutations = {
  del: state => state.notifies.splice(0, 1),
  add: (state, data) => state.notifies.push(data),
  backup: (state, data) => state.backup.unshift(data)
};
export const actions = {
  add({ commit, state }, { type = "success", position = "top-right", message = "", code = null }) {
    let obj = { type, position, message, code };
    if (state.notifies.some(el => el.message === message)) return console.log(`duplicate message ${message}`);
    commit("add", obj);
    commit("backup", obj);
  }
};
