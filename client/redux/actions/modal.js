import {
  UPDATE_RESOURCE_MODAL_OPENED,
  UPDATE_RESOURCE_MODAL_CLOSED,
} from "./index";

export const openUpdateResourceModal = () => (dispatch) => {
  dispatch({
    type: UPDATE_RESOURCE_MODAL_OPENED,
  });
};
export const closeUpdateResourceModal = () => (dispatch) => {
  dispatch({
    type: UPDATE_RESOURCE_MODAL_CLOSED,
  });
};
