import {createRequestState, getRequestState, setRequestError, setRequestState} from "../plugins/utils";

export const state = () => ({
  apiRequests: {
    login: createRequestState("success"),
    restPassword: createRequestState("success"),
    verificationInit: createRequestState("success"),
    registration: createRequestState("success")
  },
  info: null,
  load: true,
  errorData: "",
  login: false,
  isOpenKycModal: false,
  reg: false,
  reset: false,
  auth: false,
  qr: "",
  create: false,
  verifications: [],
  wallets: []
});
export const getters = {
  getRequestState,
  info: state => state.info,
  load: state => state.load,
  login: state => state.login,
  isOpenKycModal: state => state.isOpenKycModal,
  reset: state => state.reset,
  reg: state => state.reg,
  auth: state => state.auth,
  errorData: state => state.errorData,
  qr: state => state.qr,
  create: state => state.create,
  verifications: state => state.verifications,
  wallets: state => state.wallets
};

export const mutations = {
  setRequestState,
  setRequestError,
  info: (state, data) => (state.info = data),
  login: (state, data) => (state.login = data),
  changeStatusOpenKycModal: (state, data) => (state.isOpenKycModal = data),
  reg: (state, data) => (state.reg = data),
  reset: (state, data) => (state.reset = data),
  auth: (state, data) => (state.auth = data),
  errorData: (state, error) => (state.errorData = error),
  load: (state, load) => (state.load = load),
  qr: (state, data) => (state.qr = data),
  create: (state, data) => (state.create = data),
  verifications: (state, data) => (state.verifications = data),
  wallets: (state, data) => (state.wallets = data)
};

export const actions = {
  async reg({commit, dispatch}, {email, password, first_name, captcha, last_name = "", return_to}) {
    if (!last_name) {
      const fullname = first_name.split(" ");

      if (fullname.length > 1) {
        first_name = fullname[0];
        last_name = fullname[1];
      }
    }
    commit("setRequestState", {registration: "pending"});
    const partner_code = localStorage.getItem("partner");
    const apiResult = await this.app.$rest
      .api("POST:user/auth/register", {
        email: String(email).toLowerCase().trim(),
        password,
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        partner_code: partner_code || undefined,
        captcha: captcha || undefined,
        return_to: String(return_to),
        lang: this.app.i18n.locale
      })
      .catch(errorObject => {
        commit("setRequestState", {registration: "rejected"});
        commit("setRequestError", {
          errorCode: errorObject.errorCode,
          message: errorObject.message,
          key: "registration"
        });
        return null;
      });
    if (apiResult) {
      commit("reg", false);
      commit("login", true);
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.checkEmail")}, {root: true});
      commit("setRequestState", {registration: "success"});

      return apiResult;
    }
  },
  async login({commit, dispatch, state}, {email, password, captcha, code}) {
    commit("setRequestState", {login: "pending"});

    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/auth/sign-in", {
        email: String(email).toLowerCase().trim(),
        password,
        ...(captcha ? {captcha} : {}),
        ...(code ? {code: String(code).trim()} : {})
      })
      .then(r => r.data)
      .catch(errorObject => {
        commit("setRequestState", {login: "rejected"});
        commit("setRequestError", {
          errorCode: errorObject.errorCode,
          message: errorObject.message,
          key: "login"
        });
      });
    if (apiResult) {
      commit("setRequestState", {login: "success"});
      if (state.login === 'startKyc' && !apiResult.verificationPerson) {
        commit('changeStatusOpenKycModal', true);
      }
      commit("info", apiResult);
      commit("load", true);
      commit("login", false);
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.signIn")}, {root: true});
      if (this.app.$rest.ws.readyState && this.app.$rest.ws.close) this.app.$rest.ws.close();
      if (localStorage.getItem("orders")) dispatch("updateOrders", JSON.parse(localStorage.getItem("orders")));
    }
  },
  async authSocket() {
    const result = await this.app.$rest.api("POST:user/auth/socket/get/token", {}).then(r => r.data);
    const sendStatus = await this.app.$rest.ws.request("auth", {token: result.token}).catch(() => {
      return null;
    });
    return {sendWs: sendStatus, token: result.token};
  },
  async verificationInit() {
    const result = await this.app.$rest.api("POST:user/verification/init", {}).then(r => r.data);
    return result;
  },
  async editEmail({commit, dispatch}, {email}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("PUT:user/profile/edit/email", {email, lang: this.app.i18n.locale})
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
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.checkEmail")}, {root: true});
      return apiResult;
    }
  },
  async updateOrders({commit}, orders) {
    commit("load", false);
    const apiResult = await this.app.$rest.api("PUT:user/exchanger/order/update/owner", {orders});
    commit("load", true);
    if (apiResult) return localStorage.removeItem("orders");
  },
  async editPassword({commit, dispatch}, {oldPassword, newPassword}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("PUT:user/profile/edit/password", {oldPassword, newPassword})
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
      dispatch("notify/add", {}, {root: true});
      return true;
    } else return false;
  },
  async editMain({commit, dispatch}, {phone, dateOfBirth, first_name, last_name, notifyLogin, notifyChangePass}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/profile/edit/main", {
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
        notifyLogin: notifyLogin !== undefined ? notifyLogin : undefined,
        notifyChangePass: notifyChangePass !== undefined ? notifyChangePass : undefined
      })
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
    dispatch("checkAuth");
    if (apiResult) {
      return dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.editMain")}, {root: true});
    }
  },
  async restPassword({commit, dispatch}, {email, captcha}) {
    commit("load", false);
    commit("setRequestState", {restPassword: "pending"});

    const apiResult = await this.app.$rest
      .api("POST:user/auth/reset-password", {email, lang: this.app.i18n.locale, ...(captcha ? {captcha} : {})})
      .then(r => r.data)
      .catch(error => {
        commit("setRequestState", {restPassword: "rejected"});
        commit("setRequestError", {
          errorCode: error.errorCode,
          message: error.message,
          key: "restPassword"
        });
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
      commit("setRequestState", {restPassword: "success"});

      return dispatch(
        "notify/add",
        {message: this.app.i18n.t("page.main.messages.checkEmailInstructions")},
        {root: true}
      );
    }
  },
  async resetPassword({commit, dispatch}, {token, password}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/auth/reset-password/confirm", {token, password, lang: this.app.i18n.locale})
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
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.changedPassword")}, {root: true});
      if (apiResult.resultAuth) {
        commit("info", apiResult.resultAuth);
        dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.signIn")}, {root: true});
      }
      return true;
    }
  },
  async confirmEmail({commit, dispatch}, {secretCode}) {
    commit("load", false);
    await this.app.$rest
      .api("POST:user/profile/edit/email/confirm", {secretCode, lang: this.app.i18n.locale})
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
  },

  async otpCreate({commit, dispatch}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/profile/secure/otp/create")
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
      commit("qr", apiResult.otp);
    }
  },
  async otpDelete({commit, dispatch}, {code}) {
    commit("load", false);
    commit("qr", false);
    const apiResult = await this.app.$rest
      .api("DELETE:user/profile/secure/otp/delete", {code})
      .then(r => r.data)
      .catch(err => {
        commit("load", true);
        return Promise.reject(err);
      });
    dispatch("checkAuth");
    commit("load", true);
    if (!apiResult) {
      return false;
    }

    dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.2faDeleted")}, {root: true});
  },
  async otpConfirm({commit, dispatch, state}, code) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("POST:user/profile/secure/otp/confirm", {code, userId: state._id})
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
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.2faConfirmed")}, {root: true});
      dispatch("checkAuth");
    }
    return Boolean(apiResult);
  },
  async checkAuth({commit}) {
    if (process.server) return null;
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("GET:user/auth/session/get")
      .then(r => r.data)
      .catch(err => {
        if (err.errorCode === 40301) {
          return 403;
        }
        return null;
      });
    commit("load", true);
    if (apiResult && typeof apiResult === 'object') {
      commit("info", apiResult);
    }
    return apiResult;
  },
  async deleteAccount({commit, dispatch}) {
    const apiResult = await this.app.$rest
      .api("DELETE:user/profile/access/delete")
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
    commit("info", null);
    if (apiResult) dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.goodBye")}, {root: true});
  },
  async blockAccount({commit, dispatch}) {
    const apiResult = await this.app.$rest
      .api("PUT:user/profile/access/block")
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
    commit("info", null);
    if (apiResult) dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.goodBye")}, {root: true});
  },
  async getVerifications({commit, dispatch}) {
    const apiResult = await this.app.$rest
      .api("GET:user/verification/get", {limit: 999})
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
    if (apiResult) commit("verifications", apiResult.verifications);
  },
  async getWallets({commit, dispatch}) {
    const apiResult = await this.app.$rest
      .api("GET:user/wallets/balance", {})
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
    if (apiResult) commit("wallets", apiResult.wallets);
  },
  async getWalletAddress({commit, dispatch}, {walletId, network}) {
    const apiResult = await this.app.$rest
      .api("GET:user/wallets/address", {walletId, network})
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
    if (apiResult) return apiResult.wallet;
  },
  async destroyAuth({commit, dispatch}) {
    commit("load", false);
    const apiResult = await this.app.$rest
      .api("DELETE:user/auth/session/destroy")
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
    commit("info", null);
    if (apiResult) {
      dispatch("notify/add", {message: this.app.i18n.t("page.main.messages.goodBye")}, {root: true});
      return true;
    } else return false;
  }
};
