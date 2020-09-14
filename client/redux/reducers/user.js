import { USER_AUTHENTICATED } from "../actions";

const INITIAL_STATE = {
  user: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_AUTHENTICATED:
      return { ...state, user: payload };
    default:
      return state;
  }
};
