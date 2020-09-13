import React, { useState } from "react";
import Link from "next/link";

import styles from "../styles/Auth.module.scss";

const INITIAL_STATE = {
  email: "",
  password: "",
  passwordConfirm: "",
  errorMsg: "",
  successMsg: "",
};

const register = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { email, password, passwordConfirm } = formData;

  const handleChange = (evt) => {
    const { id, value } = evt.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit to endpoint
  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles["register"]}>
      <div className={styles["register__paper"]}>
        {/* Form, Left Side  */}
        <form className={styles["register__form"]} onSubmit={handleSubmit}>
          <div className={styles["register__form__control"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className={styles["register__form__control"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className={styles["register__form__control"]}>
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={handleChange}
            />
          </div>
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
