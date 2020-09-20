import { forwardRef } from "react";
import moment from "moment";

import styles from "../styles/components/linkCard.module.scss";

const LinkCard = forwardRef(({ link, onIncreaseView }, ref) => {
  return (
    <li ref={ref} key={link._id} className={styles["_container"]}>
      <div className={styles["_container__row"]}>
        <p className={styles["_container__title"]}>{link.title}</p>
        <p className={styles["_container__date"]}>
          {moment(link.createdAt).fromNow()}
        </p>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onIncreaseView(link.url)}
      >
        {link.url}
      </a>
      <div className={styles["_container__row"]}>
        <p className={styles["_container__tags"]}>
          <span>{link.isFree === true ? "FREE" : "PAID"}</span>
          <span>{link.medium.toUpperCase()}</span>
        </p>
        <p className={styles["_container__views"]}>
          <i className="far fa-eye"></i> <span>{link.views}</span> Views
        </p>
        <p className={styles["_container__user"]}>
          <i className="fas fa-user"></i> {link.postedBy.name}
        </p>
      </div>
    </li>
  );
});

export default LinkCard;
