import React, { useState, useRef, useCallback } from "react";
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
  const observerRef = useRef();

  // Infinite Scrolling
  const lastNode = useCallback(
    (lastNode) => {
      if (!links.length) return;
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting && // If the last current last node is on the screen
          links.length - prevLinksLength.current >= LIMIT // And there are more nodes to fetch
        ) {
          handleLoadMore();
        }
      });
      if (lastNode) observerRef.current.observe(lastNode); // Observe the last node
    },
    [isLoading, links.length]
  );

  // Load more links
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

  // Increase view count
  const handleView = async (url) => {
    try {
      const res = await axios.patch(`${API}/v1/links/views/increase`, { url });
      const modifiedLink = res.data.data.link;
      setLinks((prev) =>
        prev.map((link) =>
          link._id === modifiedLink._id ? modifiedLink : link
        )
      );
    } catch (error) {
      console.error(error);
    }
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
            {links.map((link, idx) => (
              <li
                ref={idx + 1 === links.length ? lastNode : undefined}
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
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleView(link.url)}
                >
                  {link.url}
                </a>
                <div className={styles["_container__left__linkItem__row"]}>
                  <p className={styles["_container__left__linkItem__tags"]}>
                    <span>{link.isFree === true ? "FREE" : "PAID"}</span>
                    <span>{link.medium.toUpperCase()}</span>
                  </p>
                  <p className={styles["_container__left__linkItem__views"]}>
                    <i className="far fa-eye"></i> <span>{link.views}</span>{" "}
                    Views
                  </p>
                  <p className={styles["_container__left__linkItem__user"]}>
                    <i className="fas fa-user"></i> {link.postedBy.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles["_container__left__buttonBox"]}>
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
