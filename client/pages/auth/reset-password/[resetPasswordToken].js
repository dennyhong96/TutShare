import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ErrorSuccessMsg from "../../../components/ErrorSuccessMsg";
import axios from "../../../utils/axios";
import { API } from "../../../config";
import styles from "../../../styles/pages/resetPassowrd.module.scss";

const INITIAL_STATE = {
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState(INITIAL_STATE);
  const { password, confirmPassword } = formData;

  const [token, setToken] = useState("");

  useEffect(() => {
    if (router.query.resetPasswordToken) {
      setToken(router.query.resetPasswordToken);

      // Hide token from browser url
      window.history.pushState({}, "", "/auth/reset-password");
    }
  }, [router.query.resetPasswordToken]);

  const handleChange = (evt) => {
    evt.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (password !== confirmPassword) {
      return setErrorMsg("Passwords must match.");
    }

    try {
      const res = await axios.post(`${API}/v1/auth/reset-password`, {
        password,
        resetPasswordToken: token,
      });
      console.log(res.data);
      setSuccessMsg(res.data.data.msg);
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response.data.errors.map((e) => e.msg).join(" "));
    }
  };

  return (
    <div className={styles["reset-password"]}>
      <div className={styles["reset-password__card"]}>
        <h1>Enter your new password</h1>
        <form
          className={styles["reset-password__form"]}
          onSubmit={handleSubmit}
        >
          <div className={styles["reset-password__form__form-control"]}>
            <input
              type="text"
              placeholder="Enter a new password."
              value={password}
              onChange={handleChange}
              name="password"
            />
          </div>
          <div className={styles["reset-password__form__form-control"]}>
            <input
              type="text"
              placeholder="Confirm your new password."
              value={confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
            />
          </div>
          <button className={styles["reset-password__form__button"]}>
            Confirm <i className="fas fa-check"></i>
          </button>
        </form>
        <ErrorSuccessMsg successMsg={successMsg} errorMsg={errorMsg} />
      </div>
    </div>
  );
};

export default ResetPassword;
