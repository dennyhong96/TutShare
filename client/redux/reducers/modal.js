import {
  UPDATE_RESOURCE_MODAL_CLOSED,
  UPDATE_RESOURCE_MODAL_OPENED,
} from "../actions/index";

const INITIAL_STATE = {
  updateResource: false,
};

const modalReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_RESOURCE_MODAL_OPENED:
      return {
        ...state,
        updateResource: true,
      };
    case UPDATE_RESOURCE_MODAL_CLOSED:
      return {
        ...state,
        updateResource: false,
      };
    default:
      return state;
  }
};

export default modalReducer;
