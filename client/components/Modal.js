import React, { Fragment, useState } from "react";
import clsx from "clsx";

import styles from "../styles/components/modal.module.scss";

const Modal = ({ children, show = true, onHide }) => {
  return (
    <Fragment>
      <div
        onClick={onHide}
        className={clsx(styles[`_backdrop`], {
          [styles[`_backdrop-show`]]: show,
        })}
      />
      <div
        className={clsx(styles[`_container`], {
          [styles[`_container-show`]]: show,
        })}
      >
        <button className={styles[`_container__button`]} onClick={onHide}>
          <i class="fas fa-times"></i>
        </button>
        {children}
      </div>
    </Fragment>
  );
};

export default Modal;
