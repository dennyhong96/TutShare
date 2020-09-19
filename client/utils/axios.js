import axios from "axios";

export default axios.create({
  // For aioxs to attach cookies with every requests
  withCredentials: true,
});
