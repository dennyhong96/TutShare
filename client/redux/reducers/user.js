import {
  AUTH_ERROR,
  USER_AUTHENTICATED,
  CLEAR_MESSAGE,
  LOGIN_SUCCESS,
} from "../actions";

const INITIAL_STATE = {
  user: null,
  errorMsg: "",
  successMsg: "",
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTHENTICATED:
      return { ...state, user: payload };
    case LOGIN_SUCCESS:
      return { ...state, successMsg: "Log in success." };
    case AUTH_ERROR:
      return { ...INITIAL_STATE, errorMsg: payload };
    case CLEAR_MESSAGE:
      return { ...state, errorMsg: "", successMsg: "" };
    default:
      return state;
  }
};
