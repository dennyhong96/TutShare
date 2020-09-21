import React, { useState, useEffect } from "react";

import axios from "../utils/axios";
import { API } from "../config";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import styles from "../styles/components/interestPopup.module.scss";

const InterestPopup = () => {
  const user = useSelector(({ user: { user } }) => user);

  const [neverShowPopup, setNeverShowPopup] = useState(
    localStorage.getItem("HIDE_INTEREST_POPUP")
  );

  const handleNeverShow = () => {
    localStorage.setItem("HIDE_INTEREST_POPUP", "TRUE");
    setNeverShowPopup("TRUE");
  };

  const [categories, setCategories] = useState(null);
  const [categorySelection, setCategorySelection] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/v1/categories`);

        setCategories(res.data.data.categories);
        setCategorySelection(
          res.data.data.categories.reduce((acc, cur) => {
            acc[cur] = false;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error(error.response);
      }
    })();
  }, []);

  const handleCategoryChange = (evt) => {
    const { id } = evt.target;
    setCategorySelection((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateInterest = async () => {
    try {
      const interestedIn = Object.keys(categorySelection).reduce((acc, cur) => {
        return categorySelection[cur] ? [...acc, cur] : acc;
      }, []);
      const res = await axios.patch(`${API}/v1/users/interests`, {
        interestedIn,
      });
      console.log(res.data);
      setNeverShowPopup("TRUE");
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <Modal show={!neverShowPopup && user && !user.interestedIn.length}>
      <div className={styles["_wrapper"]}>
        <h4>Please select tenologies you are interested in.</h4>
        <div className={styles["_input-section"]}>
          {categories &&
            categorySelection &&
            categories.map((cate) => (
              <label
                key={cate._id}
                className={styles["_input-section__check"]}
                htmlFor={cate._id}
              >
                <input
                  type="checkbox"
                  hidden
                  checked={categorySelection[cate._id]}
                  id={cate._id}
                  onChange={handleCategoryChange}
                />
                <div className={styles["_input-section__check__icon"]}>
                  {categorySelection[cate._id] ? (
                    <i className="far fa-check-square"></i>
                  ) : (
                    <i className="far fa-square"></i>
                  )}
                </div>
                <p className={styles["_input-section__check__name"]}>
                  {cate.name}
                </p>
              </label>
            ))}
        </div>
        <p>
          You will receive email notifications when new resources of your
          interest come in.
        </p>
        <small>
          You can always update your selection from your account page.
        </small>
        <div className={styles["_actions"]}>
          <button
            className={styles["_actions__neverShow"]}
            onClick={handleNeverShow}
          >
            Never show again
          </button>
          <button
            className={styles["_actions__confirm"]}
            onClick={handleUpdateInterest}
          >
            Update interests
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InterestPopup;
