import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";

import { API } from "../../../config";

const ConfirnRegister = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      // Get token from url
      const token = router.query.token;

      if (token) {
        // Hide the token in url without refresh
        window.history.pushState({}, "", "/auth/activate");

        let decoded;

        try {
          decoded = jwt.decode(token);
        } catch (error) {
          return setErrorMsg(
            "Sorry, your token has expired. Please try again."
          );
        }

        setUsername(decoded.name);

        const res = await axios.post(`${API}/v1/auth/activate`, decoded);
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
