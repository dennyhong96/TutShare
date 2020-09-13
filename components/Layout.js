import React, { Fragment } from "react";

import styles from "../styles/Layout.module.scss";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <nav className={styles["navbar"]}>
        <div className={styles["navbar__inner"]}>
          <h4 className={styles["navbar__brand"]}>TutShare</h4>
          <div className={styles["navbar__links"]}>
            <a className={styles["navbar__links__item"]} href="">
              <span>Home</span>
            </a>
            <a className={styles["navbar__links__item"]} href="">
              <span>Login</span>
            </a>
            <a className={styles["navbar__links__item"]} href="">
              <span>Register</span>
            </a>
          </div>
        </div>
      </nav>
      <div className={styles["content"]}>{children}</div>
    </Fragment>
  );
};

export default Layout;
