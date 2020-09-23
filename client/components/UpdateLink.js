import React, { useState } from "react";
import { useSelector } from "react-redux";

import axios from "../utils/axios";
import { API } from "../config";
import styles from "../styles/components/updateLink.module.scss";
import ErrorSuccessMsg from "./ErrorSuccessMsg";
import useErrorSuccess from "../hooks/useErrorSuccess";

const MEDIUM_OPTIONS = ["video", "book", "e-book", "article"];

const INIITAL_CATEGORIES_DATA = (preCategories, link) =>
  preCategories.reduce((acc, cur) => {
    acc[[cur._id]] = link.categories.includes(cur._id) ? true : false;
    return acc;
  }, {});

const INITIAL_MEDIUM_DATA = (link) =>
  MEDIUM_OPTIONS.reduce((acc, cur, idx) => {
    acc[cur] = link.medium === cur ? true : false;
    return acc;
  }, {});

const create = ({ preCategories, link, onLinkUpdated }) => {
  const user = useSelector(({ user: { user } }) => user);

  // Categories checkbox
  const [categories, setCategories] = useState(
    INIITAL_CATEGORIES_DATA(preCategories, link)
  );

  // Resource medium radio buttons
  const [medium, setMedium] = useState(INITIAL_MEDIUM_DATA(link));

  // Is free resource radio buttsons
  const [isFree, setIsFree] = useState(link.isFree);

  // Right side form
  const [formData, setFormData] = useState({
    title: link.title,
    url: link.url,
  });

  const { title, url } = formData;

  // Error and success message
  const {
    errorMsg,
    successMsg,
    setErrorMsg,
    setSuccessMsg,
    clearMsg,
  } = useErrorSuccess();

  const handleCategoryChange = (evt) => {
    clearMsg();
    const { id } = evt.target;
    setCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMediumChange = (key) => {
    clearMsg();
    setMedium({
      ...MEDIUM_OPTIONS.reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {}),
      [key]: true,
    });
  };

  const handleFormChange = (evt) => {
    clearMsg();
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (evt) => {
    evt.preventDefault();
    clearMsg();

    const selectedCategories = Object.keys(categories).reduce((acc, cur) => {
      if (categories[cur]) return [...acc, cur];
      return acc;
    }, []);

    const selectedMedium = Object.keys(medium).find((key) => medium[key]);

    if (!selectedCategories.length) {
      return setErrorMsg("At least one category is required.");
    }

    if (!(title && url)) {
      return setErrorMsg("Title and url are required.");
    }

    try {
      const res = await axios.patch(`${API}/v1/links/${link._id}`, {
        ...formData,
        categories: selectedCategories,
        medium: selectedMedium,
        isFree,
      });

      setSuccessMsg("Resource is already updated.");

      onLinkUpdated(res.data.data.link);

      // Reset all input fields
      setFormData({
        title: res.data.data.link.title,
        url: res.data.data.link.url,
      });
      setCategories(INIITAL_CATEGORIES_DATA(preCategories, res.data.data.link));
      setMedium(INITIAL_MEDIUM_DATA(res.data.data.link));
      setIsFree(res.data.data.link.isFree);
    } catch (error) {
      console.error(error.response);
      setErrorMsg(error.response.data.errors.map((e) => e.msg).join(" "));
    }
  };

  return (
    <div className={styles["_container"]}>
      <div className={styles["_container__left"]}>
        <div className={styles["_container__left__paper"]}>
          <h1 className={styles["_container__left__title"]}>
            Share learning resource
          </h1>
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
                  onChange={handleCategoryChange}
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
                onChange={() => {
                  setIsFree(true);
                  clearMsg();
                }}
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
                onChange={() => {
                  setIsFree(false);
                  clearMsg();
                }}
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

      {/* Right side form */}
      <div className={styles["_container__right"]}>
        <div className={styles["_container__right__paper"]}>
          <form onSubmit={handleUpdate}>
            <div className={styles["_container__right__form-control"]}>
              <label htmlFor="share-title">Title</label>
              <input
                type="text"
                id="share-title"
                placeholder="Give your resource a title."
                value={title}
                onChange={handleFormChange}
                name="title"
              />
            </div>
            <div className={styles["_container__right__form-control"]}>
              <label htmlFor="share-url">Url</label>
              <input
                type="text"
                id="share-url"
                placeholder="Paste your the url of your resource here."
                value={url}
                onChange={handleFormChange}
                name="url"
              />
            </div>
            <button
              className={styles["_container__right__form-button"]}
              disabled={!user}
            >
              Update
            </button>
          </form>
          <ErrorSuccessMsg successMsg={successMsg} errorMsg={errorMsg} />
        </div>
      </div>
    </div>
  );
};

export default create;
