import axios from "../../utils/axios";
import cookies from "js-cookie";

import { API } from "../../config";
import { USER_AUTHENTICATED, LOGOUT } from "./index";

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get(`${API}/v1/auth`);
    console.log(res.data);
    dispatch({
      type: USER_AUTHENTICATED,
      payload: res.data.data.user,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const activateUesr = (token) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/activate`, { token });

    // Store load user token into cookies
    if (process.browser) {
      cookies.set("AUTH_TOKEN", res.data.data.token);
    }

    await dispatch(loadUser());
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

export const loginUser = (formData) => async (dispatch) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/login`, formData);

    // Store load user token into cookies
    if (process.browser) {
      cookies.set("AUTH_TOKEN", res.data.data.token);
    }

    await dispatch(loadUser());
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};

export const logoutUser = () => (dispatch) => {
  // Remove user token from cookies
  if (process.browser) {
    cookies.remove("AUTH_TOKEN");
  }

  dispatch({
    type: LOGOUT,
  });
};
