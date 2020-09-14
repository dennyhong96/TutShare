import React from "react";

import styles from "../styles/components/AuthFeatures.module.scss";

const FEATURES = [
  {
    icon: <i className="fas fa-laptop-code"></i>,
    title: "Developement",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia nam alias ab!",
  },
  {
    icon: <i className="fas fa-edit"></i>,
    title: "Updates",
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem iste quisquam facere voluptas.",
  },
  {
    icon: <i className="fas fa-gifts"></i>,
    title: "Features",
    text:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium minima doloribus modi.",
  },
];

const register = () => {
  return (
    <div className={styles["features"]}>
      {FEATURES.map(({ icon, title, text }, idx) => (
        <div key={`${title}-${idx}`} className={styles["features__item"]}>
          {icon}
          <div>
            <h4>{title}</h4>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default register;
