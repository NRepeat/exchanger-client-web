import {createRequestState, getRequestState, setRequestState} from "../plugins/utils";

export const state = () => ({
  apiRequests: {
    getSocials: createRequestState()
  },
  socials: {
    data: [],
    error: {}
  }
});
export const getters = {
  getRequestState,
  getSocials: state => state.socials
};

export const mutations = {
  setRequestState,
  setSocials: (state, {data, error}) => {
    state.socials = {data, error};
  }
};

export const actions = {
  async updateSocials({commit}) {
    commit("setRequestState", {getSocials: "pending"});
    const result = await this.app.$rest
      .api("GET:public/social-networks/list")
      .then(r => r.data)
      .catch(err => {
        commit("setRequestState", {getSocials: "rejected"});
        commit("setSocials", {error: err});
      });
    commit("setSocials", {data: result.socials});
    commit("setRequestState", {getSocials: "success"});
  }
};
