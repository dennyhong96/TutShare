import React, { Fragment } from "react";
import NProgress from "nprogress";
import Link from "next/link";
import Router from "next/router";

import styles from "../styles/Layout.module.scss";

// Configure nprogress bar
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Navbar links
const LINK_OPTIONS = [
  { name: "Home", link: "/" },
  { name: "Login", link: "/login" },
  { name: "Register", link: "/register" },
];

const Layout = ({ children }) => {
  return (
    <Fragment>
      <nav className={styles["navbar"]}>
        <div className={styles["navbar__inner"]}>
          <h4 className={styles["navbar__brand"]}>TutShare</h4>
          <div className={styles["navbar__links"]}>
            {LINK_OPTIONS.map(({ name, link }, idx) => (
              <Link href={link} key={`${name}-${idx}`}>
                <a className={styles["navbar__links__item"]}>
                  <span>{name}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className={styles["content"]}>{children}</div>
    </Fragment>
  );
};

export default Layout;
