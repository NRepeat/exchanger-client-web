import {createRequestState, getRequestState, setRequestState} from "../plugins/utils";

export const state = () => ({
  apiRequests: {
    getReviews: createRequestState(),
    createReview: createRequestState()
  },
  reviews: {}
});

export const getters = {
  getRequestState
};

export const mutations = {
  setRequestState,
  setReviewsState: (state, {reviews, lang, page, limit}) => {
    if (!reviews || !Array.isArray(reviews)) {
      throw new Error("[store/reviews/setReviewsState] reviews is not array");
    }
    if (!lang || typeof lang !== "string") {
      throw new Error("[store/reviews/setReviewsState] lang is not string");
    }
    state.reviews[lang] = {list: reviews, page, limit, updateAt: Date.now()};
  }
};

export const actions = {
  /**
   * @param commit
   * @param dispatch
   * @param limit - limit per page
   * @param page - page
   * @param lang
   * @return {Promise<{reviews: (reviews|{}|{data, computed, watch, created, methods}|
   * default.components.reviews|Array|*), limit: *, page: *, lang: *}>}
   */
  async updateListReviews({commit, dispatch}, {limit, page, lang}) {
    commit("setRequestState", {getReviews: "pending"});

    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    if (!lang) {
      lang = "en";
    }
    const apiResult = await this.app.$rest
      .api("GET:public/reviews/get", {limit, page, lang})
      .then(r => r.data)
      .catch(error => {
        commit("setRequestState", {getReviews: "rejected"});

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
      commit("setRequestState", {getReviews: "success"});
      commit("setReviewsState", {reviews: apiResult.reviews, lang, page, limit});
      return {
        reviews: apiResult.reviews,
        select_page: apiResult.count.select_page,
        total_pages: apiResult.count.pages,
        lang,
        limit
      };
    }
    return null;
  },
  async createReview({dispatch, commit}, obj) {
    commit("setRequestState", {createReview: "pending"});

    const apiResult = await this.app.$rest
      .api("POST:public/reviews/create", obj)
      .then(r => r.data)
      .catch(error => {
        commit("setRequestState", {createReview: "rejected"});

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
      commit("setRequestState", {createReview: "success"});
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.reviewSuccess")}, {root: true});
      return apiResult;
    }
  }
};
