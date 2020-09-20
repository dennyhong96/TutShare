import { forwardRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";

import styles from "../styles/components/linkCard.module.scss";

const LinkCard = forwardRef(
  (
    {
      link,
      onIncreaseView,
      onSelectUpdate,
      onSelectDelete,
      enableEdit = false,
    },
    ref
  ) => {
    const user = useSelector(({ user: { user } }) => user);
    return (
      <li ref={ref} key={link._id} className={styles["_container"]}>
        {/* Card Header */}
        <div className={styles["_container__row"]}>
          <p className={styles["_container__title"]}>{link.title}</p>
          <p className={styles["_container__date"]}>
            {moment(link.createdAt).fromNow()}
          </p>
        </div>

        {/* Card Link */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onIncreaseView(link.url)}
        >
          {link.url}
        </a>

        {/* Card footer */}
        <div className={styles["_container__row"]}>
          <p className={styles["_container__tags"]}>
            <span>{link.isFree === true ? "FREE" : "PAID"}</span>
            <span>{link.medium.toUpperCase()}</span>
          </p>
          <p className={styles["_container__views"]}>
            <i className="far fa-eye"></i> <span>{link.views}</span> Views
          </p>

          {/* Action buttons | User' name */}
          {enableEdit && user && user._id === link.postedBy._id ? (
            <div className={styles["_container__actions"]}>
              <button
                className={styles["_container__actions-update"]}
                onClick={onSelectUpdate}
              >
                <i className="fas fa-pen-alt"></i>
              </button>
              <button
                className={styles["_container__actions-delete"]}
                onClick={onSelectDelete}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ) : (
            <p className={styles["_container__user"]}>
              <i className="fas fa-user"></i> {link.postedBy.name}
            </p>
          )}
        </div>
      </li>
    );
  }
);

export default LinkCard;
