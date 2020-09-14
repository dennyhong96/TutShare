import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import axios from "axios";

import { loadUser } from "../../../redux/actions/user";
import { API } from "../../../config";

const ConfirnRegister = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      // Get activation token from url
      const token = router.query.token;
      if (token) {
        // Hide the token in url without refresh
        window.history.pushState({}, "", "/auth/activate");

        // Handle activation token not valid
        let decoded;
        try {
          decoded = jwt.decode(token);
        } catch (error) {
          return setErrorMsg(
            "Sorry, your token has expired or is invalid. Please try again."
          );
        }

        // Set username for display message
        setUsername(decoded.name);

        try {
          // Activate user
          const res = await axios.post(`${API}/v1/auth/activate`, { token });

          // Store load user token into localstorage
          localStorage.setItem("TOKEN", res.data.data.token);

          // Load user
          dispatch(loadUser());
        } catch (error) {
          console.error(error.response);
        }
      }
    })();
  }, [router.query.token]);

  return (
    <div className="">
      <p>Hi {username}, thanks for confirming your email address.</p>
    </div>
  );
};

export default ConfirnRegister;
