import axios from "axios";

import { API } from "../../config";
import {
  USER_AUTHENTICATED,
  CLEAR_MESSAGE,
  AUTH_ERROR,
  SET_SUCCESS_MSG,
} from "./index";
import setTokenHeader from "../../utils/setTokenHeader";

// Used for clearing previous timeout
let TIMEOUT_ID;

export const loadUser = () => async (dispatch) => {
  setTokenHeader(localStorage.getItem("TOKEN"));
  try {
    const res = await axios.get(`${API}/v1/auth`);
    console.log(res.data);
    dispatch({
      type: USER_AUTHENTICATED,
      payload: res.data.data,
    });
  } catch (error) {
    console.error(error.response);
    dispatch(
      setError(error.response.data.errors.map(({ msg }) => msg).join(" "), 5000)
    );
  }
};

export const activateUesr = (token) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/activate`, { token });

    // Store load user token into localstorage
    localStorage.setItem("TOKEN", res.data.data.token);

    dispatch(loadUser());
    dispatch(clearToastMsg(7500));
  } catch (error) {
    console.error(error.response);
    dispatch(
      setError(error.response.data.errors.map(({ msg }) => msg).join(" "), 5000)
    );
  }
};

export const loginUser = (formData) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/login`, formData);

    // Store load user token into localstorage
    localStorage.setItem("TOKEN", res.data.data.token);

    dispatch(loadUser());
    dispatch(setSuccess("Log in success.", 2500));
  } catch (error) {
    console.error(error.response);
    dispatch(
      setError(error.response.data.errors.map(({ msg }) => msg).join(" "), 5000)
    );
  }
};

export const clearToastMsg = (duration) => async (dispatch) => {
  // Clear previous timeout if not complete
  if (TIMEOUT_ID) {
    clearTimeout(TIMEOUT_ID);
  }

  TIMEOUT_ID = setTimeout(() => {
    dispatch({
      type: CLEAR_MESSAGE,
    });
  }, duration);
};

export const setError = (errorMsg, duration) => async (dispatch) => {
  dispatch({
    type: AUTH_ERROR,
    payload: errorMsg,
  });
  dispatch(clearToastMsg(duration));
};

export const setSuccess = (successMsg, duration) => async (dispatch) => {
  dispatch({
    type: SET_SUCCESS_MSG,
    payload: successMsg,
  });
  dispatch(clearToastMsg(duration));
};
