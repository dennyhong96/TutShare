import React, { Fragment } from "react";

import styles from "../styles/components/errorSuccessMsg.module.scss";

const ErrorSuccessMsg = ({ errorMsg, successMsg }) => {
  return (
    <div className={styles["error-success-msg"]}>
      {!!errorMsg && (
        <p className={styles["error-success-msg__error"]}>
          <i className="fas fa-exclamation-circle"></i>
          {errorMsg}
        </p>
      )}
      {!!successMsg && (
        <p className={styles["error-success-msg__success"]}>
          <i className="far fa-check-circle"></i>
          {successMsg}
        </p>
      )}
    </div>
  );
};

export default ErrorSuccessMsg;
