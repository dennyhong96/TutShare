import React, { useState } from "react";
import axios from "../../utils/axios";

import { API } from "../../config";
import styles from "../../styles/pages/CreateLink.module.scss";

const MEDIUM_OPTIONS = ["video", "book", "e-book", "article"];

const create = ({ preCategories }) => {
  // Categories checkbox
  const [categories, setCategories] = useState(
    preCategories.reduce((acc, cur) => {
      acc[[cur._id]] = false;
      return acc;
    }, {})
  );

  // Resource medium radio buttons
  const [medium, setMedium] = useState(
    MEDIUM_OPTIONS.reduce((acc, cur, idx) => {
      acc[cur] = idx === 0 ? true : false;
      return acc;
    }, {})
  );

  // Is free resource radio buttons
  const [isFree, setIsFree] = useState(true);

  const handleIsFree = (evt) => {
    const { id } = evt.target;
    setCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMediumChange = (key) => {
    setMedium({
      ...MEDIUM_OPTIONS.reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {}),
      [key]: true,
    });
  };

  const handleSubmit = async (evt) => {
    // evt.preventDefualt();
    console.log(
      Object.keys(categories).reduce((acc, cur) => {
        if (categories[cur]) return [...acc, cur];
        return acc;
      }, [])
    );

    console.log(Object.keys(medium).find((key) => medium[key]));

    console.log(isFree);
  };

  return (
    <div className={styles["_container"]}>
      <button onClick={handleSubmit}>dsfsdf</button>
      <div className={styles["_container__left"]}>
        <div className={styles["_container__left__paper"]}>
          {/* Categories checkbox */}
          <h4 className={styles["_container__left__label"]}>Categories:</h4>
          <div className={styles["_container__left__input-section"]}>
            {preCategories.map((cate) => (
              <label
                key={cate._id}
                className={styles["_container__left__check"]}
                htmlFor={cate._id}
              >
                <input
                  type="checkbox"
                  hidden
                  checked={categories[cate._id]}
                  id={cate._id}
                  onChange={handleIsFree}
                />
                <div className={styles["_container__left__check__icon"]}>
                  {categories[cate._id] ? (
                    <i className="far fa-check-square"></i>
                  ) : (
                    <i className="far fa-square"></i>
                  )}
                </div>
                <p className={styles["_container__left__check__name"]}>
                  {cate.name}
                </p>
              </label>
            ))}
          </div>

          {/* Free or not */}
          <h4 className={styles["_container__left__label"]}>Free resource?</h4>
          <div className={styles["_container__left__input-section"]}>
            <label
              className={styles["_container__left__check"]}
              htmlFor="free-resource"
            >
              <input
                type="radio"
                name="isFree"
                hidden
                checked={isFree}
                onChange={() => setIsFree(true)}
                id="free-resource"
              />
              <div className={styles["_container__left__check__icon"]}>
                {isFree ? (
                  <i className="fas fa-dot-circle"></i>
                ) : (
                  <i className="far fa-circle"></i>
                )}
              </div>
              <p className={styles["_container__left__check__name"]}>Free</p>
            </label>
            <label
              className={styles["_container__left__check"]}
              htmlFor="paid-resource"
            >
              <input
                type="radio"
                name="isFree"
                id="paid-resource"
                hidden
                checked={!isFree}
                onChange={() => setIsFree(false)}
              />
              <div className={styles["_container__left__check__icon"]}>
                {!isFree ? (
                  <i className="fas fa-dot-circle"></i>
                ) : (
                  <i className="far fa-circle"></i>
                )}
              </div>
              <p className={styles["_container__left__check__name"]}>Paid</p>
            </label>
          </div>

          {/* The medium of the resource */}
          <h4 className={styles["_container__left__label"]}>
            Resource medium:
          </h4>
          <div className={styles["_container__left__input-section"]}>
            {Object.keys(medium).map((key, idx) => (
              <label
                key={`${key}-${idx}`}
                className={styles["_container__left__check"]}
                htmlFor={`medium-${key}`}
              >
                <input
                  type="radio"
                  name="medium"
                  id={`medium-${key}`}
                  hidden
                  checked={medium[key]}
                  onChange={() => handleMediumChange(key)}
                />
                <div className={styles["_container__left__check__icon"]}>
                  {medium[key] ? (
                    <i className="fas fa-dot-circle"></i>
                  ) : (
                    <i className="far fa-circle"></i>
                  )}
                </div>
                <p className={styles["_container__left__check__name"]}>{key}</p>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={styles["_container__right"]}>
        <div className={styles["_container__right__paper"]}></div>
      </div>
    </div>
  );
};

export default create;

export const getStaticProps = async (ctx) => {
  const res = await axios.get(`${API}/v1/categories`);
  return {
    revalidate: 1,
    props: {
      preCategories: res.data.data.categories,
    },
  };
};
