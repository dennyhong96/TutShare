import React, { useState } from "react";
import Link from "next/link";
import axios from "../utils/axios";

import useMobileScreen from "../hooks/useMobileScreen";
import useGuestRoute from "../hooks/useGuestRoute";
import { API } from "../config";
import styles from "../styles/pages/authenticate.module.scss";
import AuthFeatures from "../components/AuthFeautres";
import ErrorSuccessMessage from "../components/ErrorSuccessMsg";
import useErrorSuccess from "../hooks/useErrorSuccess";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const FIELDS = ({ name, email, password, passwordConfirm }) => [
  {
    id: "name",
    value: name,
    placeholder: "Enter your name",
    type: "text",
    label: "Name",
  },
  {
    id: "email",
    value: email,
    placeholder: "Enter your email",
    type: "email",
    label: "Email",
  },
  {
    id: "password",
    value: password,
    placeholder: "Enter a password",
    type: "password",
    label: "Password",
  },
  {
    id: "passwordConfirm",
    value: passwordConfirm,
    placeholder: "Confirm the password",
    type: "password",
    label: "Confirm Password",
  },
];

const register = () => {
  useGuestRoute();
  const { isMobile } = useMobileScreen(768);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { name, email, password, passwordConfirm } = formData;

  const {
    errorMsg,
    successMsg,
    setErrorMsg,
    setSuccessMsg,
    clearMsg,
  } = useErrorSuccess();

  const handleChange = (evt) => {
    clearMsg();
    const { id, value } = evt.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit to endpoint
  const handleSubmit = async (evt) => {
    clearMsg();
    evt.preventDefault();

    if (password !== passwordConfirm) {
      return setErrorMsg('"Passwords must match."');
    }

    try {
      const res = await axios.post(`${API}/v1/auth/register`, {
        name,
        email,
        password,
      });
      setSuccessMsg(res.data.data.msg);
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error.response);
      setErrorMsg(error.response.data.errors.map(({ msg }) => msg).join(" "));
    }
  };

  return (
    <div className={styles["auth"]}>
      <div className={styles["auth__paper"]}>
        <div className={styles["auth__lower"]}>
          {/* Form, Left Side  */}
          <form className={styles["auth__form"]} onSubmit={handleSubmit}>
            {FIELDS(formData).map(
              ({ id, value, placeholder, type, label }, idx) => (
                <div
                  key={`${id}-${idx}`}
                  className={styles["auth__form__control"]}
                >
                  <label htmlFor="email">{label}</label>
                  <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
            <button>Register</button>
            <small>
              Already has an account?{" "}
              <Link href="/login">
                <a>Log in &rarr;</a>
              </Link>
            </small>
            <small>
              Forget password{" "}
              <Link href="/auth/forget-password">
                <a>Reset &rarr;</a>
              </Link>
            </small>
            {isMobile && (
              <ErrorSuccessMessage
                errorMsg={errorMsg}
                successMsg={successMsg}
              />
            )}
          </form>
          {/* Features, right side */}
          <AuthFeatures />
        </div>
        {!isMobile && (
          <ErrorSuccessMessage errorMsg={errorMsg} successMsg={successMsg} />
        )}
      </div>
    </div>
  );
};

export default register;
