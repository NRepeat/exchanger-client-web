const createRequestState = type => {
  const types = {
    pending: "pending",
    rejected: "rejected",
    success: "success"
  };

  if (!type)
    return {
      isPending: false,
      isRejected: false,
      isSuccess: false,
      error: {message: "Error.", errorCode: 0}
    };

  if (type !== types[type])
    throw new Error(`Type must be pending ==> isPending,  rejected ==> isRejected, success ==> Success ${types}`);
  return {
    isPending: type === "pending",
    isRejected: type === "rejected",
    isSuccess: type === "success",
    error: {message: "Error.", errorCode: 0}
  };
};

const getRequestState = state => (type, status) => {
  if (!state.apiRequests[type]) {
    throw new Error("getRequestState type not found:" + type);
  }
  if (state.apiRequests[type][status] === undefined || state.apiRequests[type][status] === null) {
    throw new Error("getRequestState status not found:" + status);
  }
  return state.apiRequests[type][status];
};
const setRequestState = (state, statusObj) => {
  for (let key in statusObj) {
    state.apiRequests[key] = createRequestState(statusObj[key]);
  }
};
const setRequestError = (state, {key, message, errorCode}) => {
  state.apiRequests[key].error = {message, errorCode};
};

export {createRequestState, getRequestState, setRequestState, setRequestError};
