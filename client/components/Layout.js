import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NProgress from "nprogress";
import Link from "next/link";
import Router from "next/router";
import clsx from "clsx";

import { logoutUser, loadUser } from "../redux/actions/user";
import styles from "../styles/components/Layout.module.scss";

// Configure nprogress bar
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Navbar links
const LINK_OPTIONS_GUEST = [
  { name: "Home", link: "/" },
  { name: "Login", link: "/login" },
  { name: "Register", link: "/register" },
];

const LINK_OPTIONS_AUTH = [{ name: "Home", link: "/" }];

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  // Try to authenticated on page load
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const [drawerShow, setDrawerShow] = useState(false);

  // Get uesr obj from state, for deciding if user logged in or not
  const user = useSelector(({ user: { user } }) => user);
  const LINK_OPTIONS = user ? LINK_OPTIONS_AUTH : LINK_OPTIONS_GUEST;

  return (
    <Fragment>
      <nav className={styles["navbar"]}>
        <div className={styles["navbar__inner"]}>
          <Link href="/">
            <a className={styles["navbar__brand"]}>
              <span>Tut</span>Share
            </a>
          </Link>
          {/* Menu button for small screen drawer */}
          <button
            className={styles["navbar__menuBtn"]}
            onClick={() => setDrawerShow((prev) => !prev)}
          >
            <i className="fas fa-hamburger"></i>
          </button>
          <div
            className={clsx(styles["navbar__links"], {
              [styles["navbar__links-drawerShow"]]: drawerShow,
            })}
          >
            {/* Close button for small screen drawer */}
            <button
              className={styles["navbar__closeBtn"]}
              onClick={() => setDrawerShow((prev) => !prev)}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Navbar Links */}
            {LINK_OPTIONS.map(({ name, link }, idx) => (
              <Link href={link} key={`${name}-${idx}`}>
                <a
                  className={styles["navbar__links__item"]}
                  onClick={() => setDrawerShow(false)}
                >
                  <span>{name}</span>
                </a>
              </Link>
            ))}

            {/* Logout Button */}
            {user && (
              <button
                className={styles["navbar__links__item"]}
                onClick={() => {
                  setDrawerShow(false);
                  dispatch(logoutUser());
                }}
              >
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className={styles["content"]}>{children}</div>
      {/* Backdrop when drawer is open */}
      {drawerShow && (
        <div
          className={styles["backdrop"]}
          onClick={() => setDrawerShow(false)}
        />
      )}
    </Fragment>
  );
};

export default Layout;
