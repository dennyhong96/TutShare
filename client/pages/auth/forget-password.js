import { useState } from "react";

import axios from "../../utils/axios";
import { API } from "../../config";
import styles from "../../styles/pages/ForgetPassword.module.scss";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setErrMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(`${API}/v1/auth/forget-password`, {
        email,
      });
      console.log(res.data);
      setSuccessMsg(res.data.data.msg);
      setEmail("");
    } catch (error) {
      console.error(error.response);
      setErrMsg(error.response.data.errors.map((e) => e.msg).join(" "));
    }
  };

  return (
    <div className={styles["forget-password"]}>
      <div className={styles["forget-password__card"]}>
        <h1 className={styles["forget-password__card__title"]}>
          Reset your password
        </h1>
        <p className={styles["forget-password__card__prompt"]}>
          Enter your password below and we will send a link for resetting
          password to your email !
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles["forget-password__form-control"]}>
            <input
              type="text"
              id="forget-email"
              placeholder="Enter your email"
              value={email}
              onChange={(evt) => {
                setErrMsg("");
                setSuccessMsg("");
                setEmail(evt.target.value);
              }}
            />
          </div>
          <button className={styles["forget-password__button"]}>
            Send<i className="fas fa-paper-plane"></i>
          </button>
        </form>
        {!!errMsg && (
          <p className={styles["forget-password__error"]}>
            <i class="fas fa-exclamation-circle"></i>
            {errMsg}
          </p>
        )}
        {!!successMsg && (
          <p className={styles["forget-password__success"]}>
            <i class="far fa-check-circle"></i>
            {successMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
