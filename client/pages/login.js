import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";

import useMobileScreen from "../hooks/useMobileScreen";
import useGuestRoute from "../hooks/useGuestRoute";
import { loginUser } from "../redux/actions/user";
import styles from "../styles/pages/authenticate.module.scss";
import AuthFeatures from "../components/AuthFeautres";
import ErrorSuccessMessage from "../components/ErrorSuccessMsg";
import useErrorSuccess from "../hooks/useErrorSuccess";

const INITIAL_STATE = {
  email: "",
  password: "",
};

const FIELDS = ({ email, password }) => [
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
    placeholder: "Enter your password",
    type: "password",
    label: "Password",
  },
];

const login = () => {
  useGuestRoute({ delay: 1500 });
  const { isMobile } = useMobileScreen(768);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const dispatch = useDispatch();

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
    evt.preventDefault();
    clearMsg();
    try {
      await dispatch(loginUser(formData));
      setSuccessMsg("Login in success!");
    } catch (error) {
      setErrorMsg(error.response.data.errors.map((e) => e.msg).join(" "));
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
            <button>Login</button>
            <small>
              Don't have an account?{" "}
              <Link href="/register">
                <a>Register &rarr;</a>
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
                successMsg={successMsg}
                errorMsg={errorMsg}
              />
            )}
          </form>

          {/* Features, right side */}
          <AuthFeatures />
        </div>
        {!isMobile && (
          <ErrorSuccessMessage successMsg={successMsg} errorMsg={errorMsg} />
        )}
      </div>
    </div>
  );
};

export default login;
