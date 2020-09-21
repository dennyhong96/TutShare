import React, { useState, useRef, useCallback, Fragment } from "react";
import parse from "html-react-parser";
import { useRouter } from "next/router";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import LinkCard from "../../components/LinkCard";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import { API } from "../../config";
import styles from "../../styles/pages/categories.module.scss";

const LIMIT = 2;

const category = ({ preLinks, preCategory }) => {
  const [links, setLinks] = useState(preLinks);

  const {
    query: { slug },
  } = useRouter();

  // Load more links
  const handleLoadMore = async () => {
    setLoading(true);
    try {
      prevLinksLength.current = links.length;
      const res = await axios.get(
        `${API}/v1/categories/${slug}?limit=${LIMIT}&skip=${numLinksToSkip.current}`
      );
      setLinks((prev) => [...prev, ...res.data.data.links]);
      numLinksToSkip.current += res.data.data.links.length;
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Use Infinite Scroll
  const {
    lastNodeRef,
    numItemsToSkip: numLinksToSkip,
    prevItemsLength: prevLinksLength,
    isLoading,
    setLoading,
  } = useInfiniteScroll(links?.length, LIMIT, handleLoadMore);

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
      {/* Must check dynamic pages' props are available before using them. */}
      {links?.length && (
        <Fragment>
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
                  <LinkCard
                    ref={idx + 1 === links.length ? lastNodeRef : undefined}
                    key={link._id}
                    link={link}
                    onIncreaseView={handleView}
                  />
                ))}
              </ul>
              <div className={styles["_container__left__buttonBox"]}>
                {isLoading && <Loader />}
                {links.length - prevLinksLength.current < LIMIT && (
                  <p>All resources have been displayed.</p>
                )}
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
        </Fragment>
      )}
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
