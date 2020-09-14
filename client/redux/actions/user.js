import axios from "axios";

import { API } from "../../config";
import {
  USER_AUTHENTICATED,
  CLEAR_MESSAGE,
  AUTH_ERROR,
  LOGIN_SUCCESS,
} from "./index";
import setTokenHeader from "../../utils/setTokenHeader";

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
    dispatch({
      type: AUTH_ERROR,
      payload: error.response.data.errors.map(({ msg }) => msg),
    });
  }
};

export const activateUesr = (token) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/activate`, { token });

    // Store load user token into localstorage
    localStorage.setItem("TOKEN", res.data.data.token);

    dispatch(loadUser());
  } catch (error) {
    console.error(error.response);
    dispatch({
      type: AUTH_ERROR,
      payload: error.response.data.errors.map(({ msg }) => msg),
    });
  }
};

export const loginUser = (formData) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/login`, formData);

    // Store load user token into localstorage
    localStorage.setItem("TOKEN", res.data.data.token);

    dispatch({ type: LOGIN_SUCCESS });
    dispatch(loadUser());
  } catch (error) {
    console.error("from action", error);
    dispatch({
      type: AUTH_ERROR,
      payload: error.response.data.errors.map(({ msg }) => msg),
    });
  }
};

export const clearToastMsg = () => async (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};
