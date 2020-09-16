import React, { useState } from "react";
import Link from "next/link";
import axios from "../utils/axios";
import { useSelector, useDispatch } from "react-redux";

import useGuestRoute from "../hooks/useGuestRoute";
import { setError, setSuccess } from "../redux/actions/user";
import { API } from "../config";
import Toast from "../components/Toast";
import styles from "../styles/pages/Auth.module.scss";
import AuthFeatures from "../components/AuthFeautres";

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
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { name, email, password, passwordConfirm } = formData;
  const dispatch = useDispatch();
  const errorMsg = useSelector(({ user: { errorMsg } }) => errorMsg);
  const successMsg = useSelector(({ user: { successMsg } }) => successMsg);

  const handleChange = (evt) => {
    const { id, value } = evt.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit to endpoint
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (password !== passwordConfirm) {
      return dispatch(setError("Passwords must match.", 3500));
    }

    try {
      const res = await axios.post(`${API}/v1/auth/register`, {
        name,
        email,
        password,
      });
      dispatch(setSuccess(res.data.data.msg, 7500));
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error.response);
      dispatch(
        setError(
          error.response.data.errors.map(({ msg }) => msg).join(" "),
          5000
        )
      );
    }
  };

  return (
    <div className={styles["auth"]}>
      <div className={styles["auth__paper"]}>
        {/* Toast */}
        <Toast successMsg={successMsg} errorMsg={errorMsg} />
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
          </form>

          {/* Features, right side */}
          <AuthFeatures />
        </div>
      </div>
    </div>
  );
};

export default register;
