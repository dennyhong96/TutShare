import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { loginUser, clearToastMsg } from "../redux/actions/user";
import Toast from "../components/Toast";
import styles from "../styles/pages/Auth.module.scss";
import AuthFeatures from "../components/AuthFeautres";

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
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { email, password } = formData;
  const dispatch = useDispatch();
  const errorMsg = useSelector(({ user: { errorMsg } }) => errorMsg);
  const successMsg = useSelector(({ user: { successMsg } }) => successMsg);

  const handleChange = (evt) => {
    const { id, value } = evt.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Clear form data after success
  useEffect(() => {
    if (successMsg) {
      setFormData(INITIAL_STATE);
    }
  }, [successMsg]);

  // Submit to endpoint
  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className={styles["auth"]}>
      <div className={styles["auth__paper"]}>
        {/* Toast */}
        <Toast
          successMsg={successMsg}
          errorMsg={errorMsg}
          successDuration={3000}
          errorDuration={5500}
          onHide={() => dispatch(clearToastMsg())}
        />

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
              Don't have an account?{" "}
              <Link href="/register">
                <a>Register &rarr;</a>
              </Link>
            </small>
          </form>

          {/* Features, right side */}
          <AuthFeatures />
        </div>
      </div>
    </div>
  );
};

export default login;
