import React from "react";
import clsx from "clsx";

import styles from "../styles/components/Toast.module.scss";

const Toast = ({ successMsg, errorMsg }) => {
  return (
    <div
      className={clsx(styles["toast"], {
        [styles["toast-success"]]: !!successMsg,
        [styles["toast-error"]]: !!errorMsg,
      })}
    >
      {successMsg || errorMsg}
    </div>
  );
};

export default Toast;
