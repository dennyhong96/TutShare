import {
  AUTH_ERROR,
  USER_AUTHENTICATED,
  CLEAR_MESSAGE,
  SET_SUCCESS_MSG,
  LOGOUT,
} from "../actions";

const INITIAL_STATE = {
  user: null,
  errorMsg: "",
  successMsg: "",
};

const userReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTHENTICATED:
      return { ...state, user: payload };
    case LOGOUT:
      return INITIAL_STATE;
    case SET_SUCCESS_MSG:
      return { ...state, successMsg: payload };
    case AUTH_ERROR:
      return { ...INITIAL_STATE, errorMsg: payload };
    case CLEAR_MESSAGE:
      return { ...state, errorMsg: "", successMsg: "" };
    default:
      return state;
  }
};

export default userReducer;
