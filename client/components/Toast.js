import React, { useEffect } from "react";
import clsx from "clsx";

import styles from "../styles/components/Toast.module.scss";

const Toast = ({
  successMsg,
  errorMsg,
  successDuration,
  errorDuration,
  onHide,
}) => {
  // For auto hiding
  useEffect(() => {
    let timeoutId;
    if (successMsg || errorMsg) {
      timeoutId = setTimeout(
        () => {
          onHide();
        },
        successMsg ? successDuration : errorMsg && errorDuration
      );
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMsg, errorMsg]);

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
