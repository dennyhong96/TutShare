import axios from "axios";

import { API } from "../../config";
import { USER_AUTHENTICATED } from "./index";
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
    throw error;
  }
};

// Non state updating

export const activateUesr = async (token) => {
  try {
    // Activate user
    const res = await axios.post(`${API}/v1/auth/activate`, { token });

    // Store load user token into localstorage
    localStorage.setItem("TOKEN", res.data.data.token);
  } catch (error) {
    console.error(error.response);
    throw error;
  }
};
