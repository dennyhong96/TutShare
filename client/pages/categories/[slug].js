import React, { useState } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import moment from "moment";

import axios from "../../utils/axios";
import { API } from "../../config";
import styles from "../../styles/pages/category.module.scss";

const category = ({ preLinks, preCategory }) => {
  const [links, setLinks] = useState(preLinks);

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
          <ul className={styles["_container__left__links"]}>
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
  const limit = 10;
  const skip = 0;

  const res = await axios.get(
    `${API}/v1/categories/${params.slug}?limit=${limit}&skip=${skip}`
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
