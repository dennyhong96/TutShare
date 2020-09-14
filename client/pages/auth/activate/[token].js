import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";

import { activateUesr, loadUser } from "../../../redux/actions/user";

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
          // Activate user's account
          dispatch(activateUesr(token));
          setSuccessMsg("Email confirmed, you are now logged in!");
        } catch (error) {
          console.error(error.response);
          setErrorMsg(
            error.response.data.errors.map(({ msg }) => msg).join(" ")
          );
        }
      }
    })();
  }, [router.query.token]);

  return (
    <div className="">
      <p>Hi {username}, thanks for verifying your email address.</p>
      {successMsg && <p>{successMsg}</p>}
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};

export default ConfirnRegister;
