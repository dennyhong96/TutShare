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
        <div className={styles["register__features"]}>
          <div className={styles["register__features__item"]}>
            <i class="fas fa-laptop-code"></i>
            <div>
              <h4>Developement</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia
                nam alias ab!
              </p>
            </div>
          </div>
          <div className={styles["register__features__item"]}>
            <i class="fas fa-edit"></i>
            <div>
              <h4>Updates</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Exercitationem iste quisquam facere voluptas.
              </p>
            </div>
          </div>
          <div className={styles["register__features__item"]}>
            <i class="fas fa-gifts"></i>
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
