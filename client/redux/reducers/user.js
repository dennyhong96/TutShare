import { AUTH_ERROR, USER_AUTHENTICATED, LOGOUT } from "../actions";

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
    case AUTH_ERROR:
      return { ...INITIAL_STATE, errorMsg: payload };
    default:
      return state;
  }
};

export default userReducer;
