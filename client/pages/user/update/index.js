import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import axios from "../../../utils/axios";
import { API } from "../../../config";
import ErrorSuccessMsg from "../../../components/ErrorSuccessMsg";
import useErrorSuccess from "../../../hooks/useErrorSuccess";
import styles from "../../../styles/pages/userUpdateAccount.module.scss";

const getCategorySelection = (preCategories, user) =>
  preCategories
    .map((cate) => cate._id)
    .reduce((acc, cur) => {
      acc[cur] = user.interestedIn.includes(cur) ? true : false;
      return acc;
    }, {});

const getFormData = (user) => ({
  name: user.name,
  email: user.email,
  password: "",
});

const index = ({ preCategories }) => {
  const user = useSelector(({ user: { user } }) => user);
  const [categorySelection, setCategorySelection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {
    errorMsg,
    successMsg,
    setSuccessMsg,
    setErrorMsg,
    clearMsg,
  } = useErrorSuccess();

  // Pre-fill user interests
  useEffect(() => {
    if (user) {
      setCategorySelection(getCategorySelection(preCategories, user));
    }
  }, [user]);

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      setFormData(getFormData(user));
    }
  }, [user]);

  const { name, email, password } = formData;

  const handleCategoryChange = (evt) => {
    clearMsg();
    const { id } = evt.target;
    setCategorySelection((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFormChange = (evt) => {
    clearMsg();
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (evt) => {
    evt.preventDefault();
    clearMsg();

    try {
      const updateBody = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        },
        {}
      );

      updateBody.interestedIn = Object.entries(categorySelection).reduce(
        (acc, [key, value]) => {
          if (value) return [...acc, key];
          return acc;
        },
        []
      );

      const res = await axios.patch(`${API}/v1/users/interests`, updateBody);
      console.log(res.data);
      setCategorySelection(
        getCategorySelection(preCategories, res.data.data.user)
      );
      setFormData(getFormData(res.data.data.user));
      setSuccessMsg("Your profile is successfully updated.");
    } catch (error) {
      console.error(error.response);
      setCategorySelection(getCategorySelection(preCategories, user));
      setFormData(getFormData(user));
      setErrorMsg(error.response.data.errors.map((e) => e.msg).join(" "));
    }
  };

  return (
    <div className={styles["_wrapper"]}>
      <h1 className={styles["_wrapper__title"]}>Update Profile</h1>
      <form className={styles["_wrapper__inner"]} onSubmit={handleUpdate}>
        <div className={styles["_card"]}>
          <div className={styles["_card__top"]}>
            <div className={styles["_card__left"]}>
              <div className="">
                <h4 className={styles["_card__left__title"]}>
                  Update tenologies you are interested in.
                </h4>
                <div className={styles["_card__left__input"]}>
                  {preCategories &&
                    categorySelection &&
                    preCategories.map((cate) => (
                      <label
                        key={cate._id}
                        className={styles["_card__left__input__check"]}
                        htmlFor={cate._id}
                      >
                        <input
                          type="checkbox"
                          hidden
                          checked={categorySelection[cate._id]}
                          id={cate._id}
                          onChange={handleCategoryChange}
                        />
                        <div
                          className={styles["_card__left__input__check__icon"]}
                        >
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
              </div>
            </div>
            <div className={styles["_card__right"]}>
              <div className="">
                <h4 className={styles["_card__right__title"]}>
                  Update your account information.
                </h4>
                <div className={styles["_card__right__input"]}>
                  <label htmlFor="update-user-name">Name</label>
                  <input
                    type="text"
                    id="update-user-name"
                    name="name"
                    placeholder="Update your name"
                    value={name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className={styles["_card__right__input"]}>
                  <label htmlFor="update-user-email">Email</label>
                  <input
                    type="email"
                    id="update-user-email"
                    name="email"
                    placeholder="Update your email"
                    value={email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className={styles["_card__right__input"]}>
                  <label htmlFor="update-user-name">Password</label>
                  <input
                    type="password"
                    id="update-user-password"
                    name="password"
                    placeholder="Update your password"
                    value={password}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles["_card__bottom"]}>
            <button className={styles["_card__bottom__confirm"]}>
              Confirm Update
            </button>
          </div>
          <ErrorSuccessMsg errorMsg={errorMsg} successMsg={successMsg} />
        </div>
      </form>
    </div>
  );
};

export default index;

export const getStaticProps = async (ctx) => {
  const res = await axios.get(`${API}/v1/categories`);

  return {
    props: {
      preCategories: res.data.data.categories,
    },
    revalidate: 1,
  };
};
