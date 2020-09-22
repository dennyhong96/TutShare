import React from "react";

import styles from "../styles/components/authPageFeatures.module.scss";

const FEATURES = [
  {
    icon: <i className="fas fa-laptop-code"></i>,
    title: "Learn from the best",
    text:
      "Stop wasting time on random tutorials, learn from the best resources shared by the developers' community.",
  },
  {
    icon: <i class="fas fa-share-square"></i>,
    title: "Pay it forward",
    text:
      "Contribute to the community by sharing worthwhile learning resources.",
  },
  {
    icon: <i className="fas fa-gifts"></i>,
    title: `The "full-stack"`,
    text:
      "We aim to cover all topics regarding web development, frontend, backend, and deployment.",
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
