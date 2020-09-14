import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

import Toast from "../components/Toast";

import styles from "../styles/Auth.module.scss";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  errorMsg: "",
  successMsg: "",
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

const FEATURES = [
  {
    icon: <i className="fas fa-laptop-code"></i>,
    title: "Developement",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia nam alias ab!",
  },
  {
    icon: <i className="fas fa-edit"></i>,
    title: "Updates",
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem iste quisquam facere voluptas.",
  },
  {
    icon: <i className="fas fa-gifts"></i>,
    title: "Features",
    text:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium minima doloribus modi.",
  },
];

const register = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const {
    name,
    email,
    password,
    passwordConfirm,
    errorMsg,
    successMsg,
  } = formData;

  const handleChange = (evt) => {
    const { id, value } = evt.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit to endpoint
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (password !== passwordConfirm) {
      return setFormData((prev) => ({
        ...prev,
        errorMsg: "Passwords must match.",
      }));
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        { name, email, password }
      );
      setFormData({ ...INITIAL_STATE, successMsg: res.data.data.msg });
    } catch (error) {
      console.error(error.response);
      setFormData((prev) => ({
        ...prev,
        errorMsg: error.response.data.errors.map(({ msg }) => msg).join(" "),
      }));
    }
  };

  return (
    <div className={styles["register"]}>
      <div className={styles["register__paper"]}>
        {/* Toast */}
        <Toast
          successMsg={successMsg}
          errorMsg={errorMsg}
          successDuration={7000}
          errorDuration={5500}
          onHide={() =>
            setFormData((prev) => ({ ...prev, successMsg: "", errorMsg: "" }))
          }
        />

        <div className={styles["register__lower"]}>
          {/* Form, Left Side  */}
          <form className={styles["register__form"]} onSubmit={handleSubmit}>
            {FIELDS(formData).map(
              ({ id, value, placeholder, type, label }, idx) => (
                <div
                  key={`${id}-${idx}`}
                  className={styles["register__form__control"]}
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
          <div className={styles["register__features"]}>
            {FEATURES.map(({ icon, title, text }, idx) => (
              <div
                key={`${title}-${idx}`}
                className={styles["register__features__item"]}
              >
                {icon}
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
