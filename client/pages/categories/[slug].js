import React, { useState, useRef } from "react";
import parse from "html-react-parser";
import moment from "moment";
import { useRouter } from "next/router";

import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import { API } from "../../config";
import styles from "../../styles/pages/category.module.scss";

const LIMIT = 2;

const category = ({ preLinks, preCategory }) => {
  const [links, setLinks] = useState(preLinks);
  const [isLoading, setLoading] = useState(false);

  const {
    query: { slug },
  } = useRouter();

  const prevLinksLength = useRef(0);
  const skipNum = useRef(preLinks.length);
  // const isLoading = useRef(false);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      prevLinksLength.current = links.length;
      const res = await axios.get(
        `${API}/v1/categories/${slug}?limit=${LIMIT}&skip=${skipNum.current}`
      );
      setLinks((prev) => [...prev, ...res.data.data.links]);
      skipNum.current += res.data.data.links.length;
    } catch (error) {}
    setLoading(false);
  };

  return (
    <div className={styles["_container"]}>
      {/* Left side */}
      <div className={styles["_container__left"]}>
        <div className={styles["_container__left__inner"]}>
          <h1 className={styles["_container__left__title"]}>
            {preCategory.name}
          </h1>
          <div className={styles["_container__left__description"]}>
            {parse(preCategory.description)}
          </div>
          <hr />
          <ul
            className={styles["_container__left__links"]}
            id="links-container"
          >
            {links.map((link) => (
              <li
                key={link._id}
                className={styles["_container__left__linkItem"]}
              >
                <div className={styles["_container__left__linkItem__row"]}>
                  <p className={styles["_container__left__linkItem__title"]}>
                    {link.title}
                  </p>
                  <p className={styles["_container__left__linkItem__date"]}>
                    {moment(link.createdAt).fromNow()}
                  </p>
                </div>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
                <div className={styles["_container__left__linkItem__row"]}>
                  <p className={styles["_container__left__linkItem__tags"]}>
                    <span>{link.isFree === true ? "FREE" : "PAID"}</span>
                    <span>{link.medium.toUpperCase()}</span>
                  </p>
                  <p className={styles["_container__left__linkItem__views"]}>
                    <i class="far fa-eye"></i> <span>{link.views}</span> Views
                  </p>
                  <p className={styles["_container__left__linkItem__user"]}>
                    <i class="fas fa-user"></i> {link.postedBy.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles["_container__left__buttonBox"]}>
            {!isLoading &&
              !!links.length &&
              links.length - prevLinksLength.current >= LIMIT && (
                <button
                  className={styles["_container__left__buttonBox__button"]}
                  onClick={handleLoadMore}
                >
                  More<i class="far fa-caret-square-down"></i>
                </button>
              )}
            {isLoading && <Loader />}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className={styles["_container__right"]}>
        <div className={styles["_container__left__inner"]}>
          <img
            className={styles["_container__left__inner"]}
            src={preCategory.image.url}
            alt={preCategory.name}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default category;

export const getStaticProps = async ({ params }) => {
  // Fetch category detail and links of this category

  const skip = 0;

  const res = await axios.get(
    `${API}/v1/categories/${params.slug}?limit=${LIMIT}&skip=${skip}`
  );

  return {
    props: {
      preLinks: res.data.data.links,
      preCategory: res.data.data.category,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  // In order to SSG pages for all categories
  const res = await axios.get(`${API}/v1/categories`);

  return {
    paths: res.data.data.categories.map((category) => ({
      params: { slug: category.slug },
    })),
    fallback: true,
  };
};
