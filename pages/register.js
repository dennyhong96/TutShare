import React from "react";

import styles from "../styles/Auth.module.scss";

const register = () => {
  return (
    <div className={styles["register"]}>
      <div className={styles["register__paper"]}>
        <form className={styles["register__form"]}>
          <div className={styles["register__form__control"]}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className={styles["register__form__control"]}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" />
          </div>
          <div className={styles["register__form__control"]}>
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              placeholder="Confirm your password"
            />
          </div>
          <button>Register</button>
        </form>
        <div className={styles["register__features"]}>Features</div>
      </div>
    </div>
  );
};

export default register;
