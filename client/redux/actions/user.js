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
  }
};
