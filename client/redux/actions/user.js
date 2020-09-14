import axios from "axios";

import { API } from "../../config";
import { USER_AUTHENTICATED } from "./index";

export const loadUser = () => async (disptch) => {
  try {
    const res = await axios.get(`${API}/auth`);
    console.log(res.data);
  } catch (error) {
    console.error(error.response);
  }
};
