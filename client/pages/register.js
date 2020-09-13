import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

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
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        { name, email, password }
      );
      console.log(res.data);
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles["register"]}>
      <div className={styles["register__paper"]}>
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
          <div className={styles["register__features__item"]}>
            <i className="fas fa-laptop-code"></i>
            <div>
              <h4>Developement</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia
                nam alias ab!
              </p>
            </div>
          </div>
          <div className={styles["register__features__item"]}>
            <i className="fas fa-edit"></i>
            <div>
              <h4>Updates</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Exercitationem iste quisquam facere voluptas.
              </p>
            </div>
          </div>
          <div className={styles["register__features__item"]}>
            <i className="fas fa-gifts"></i>
            <div>
              <h4>Features</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Accusantium minima doloribus modi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
