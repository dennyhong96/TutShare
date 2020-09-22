import React, { useState, useRef, useCallback, Fragment } from "react";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import Head from "next/head";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import LinkCard from "../../components/LinkCard";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import { API, APP_NAME } from "../../config";
import withoutHTMLTags from "../../utils/withoutHTMLTags";
import styles from "../../styles/pages/categorie.module.scss";

const LIMIT = 2;

const category = ({ preLinks, preCategory, preTrendingLinks }) => {
  const head = () => (
    <Head>
      <title>
        {preCategory?.name} | {APP_NAME}
      </title>
      <meta
        name="description"
        content={`${preCategory?.name} learning resources | ${
          preCategory ? withoutHTMLTags(preCategory.description) : ""
        }`}
      />
      {/* Open gaphs: For facebook sharing, etc */}
      {/* <meta property="og:image:secure_url" content={preCategory?.image.url} /> */}
      <meta property="og:image" content={preCategory?.image.url} />
      <meta property="og:title" content={preCategory?.name} />
      <meta
        property="og:description"
        content={`${preCategory?.name} learning resources | ${
          preCategory ? withoutHTMLTags(preCategory.description) : ""
        }`}
      />
    </Head>
  );

  const [links, setLinks] = useState(preLinks);
  const [trendingLinks, setTrendingLinks] = useState(preTrendingLinks);

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
  const handleIncreseView = async (url, isTrendingLink = false) => {
    try {
      const res = await axios.patch(`${API}/v1/links/views/increase`, { url });
      const modifiedLink = res.data.data.link;

      if (links.map((l) => l.url).includes(url)) {
        setLinks((prev) =>
          prev.map((link) =>
            link._id === modifiedLink._id ? modifiedLink : link
          )
        );
      }

      if (trendingLinks.map((l) => l.url).includes(url)) {
        setTrendingLinks((prev) =>
          prev.map((link) =>
            link._id === modifiedLink._id ? modifiedLink : link
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      {head()}
      <div className={styles["_container"]}>
        {/* Must check dynamic pages' props are available before using them. */}
        {preCategory && (
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
                  {!!links.length &&
                    links.map((link, idx) => (
                      <LinkCard
                        ref={idx + 1 === links.length ? lastNodeRef : undefined}
                        key={link._id}
                        link={link}
                        onIncreaseView={handleIncreseView}
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
              <div className={styles["_container__right__inner"]}>
                <h1 className={styles["_container__right__title-alt"]}>
                  {preCategory.name}
                </h1>
                <div className={styles["_container__right__description"]}>
                  {parse(preCategory.description)}
                </div>
                <img
                  className={styles["_container__right__img"]}
                  src={preCategory.image.url}
                  alt={preCategory.name}
                  width="100%"
                />
              </div>

              <h2 className={styles["_container__right__title"]}>
                Tranding MongoDB resources 🔥
              </h2>

              <ul className={styles["_container__right__trending"]}>
                {trendingLinks.map((link) => (
                  <LinkCard key={link._id} link={link} />
                ))}
              </ul>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default category;

export const getStaticProps = async ({ params }) => {
  // Fetch category detail and links of this category

  const skip = 0;

  const preLinksCatePromise = axios.get(
    `${API}/v1/categories/${params.slug}?limit=${LIMIT}&skip=${skip}`
  );

  const trendingLinksPromise = axios.get(
    `${API}/v1/links/popular/${params.slug}`
  );

  const [preLinksCateRes, trendingLinksRes] = await Promise.all([
    preLinksCatePromise,
    trendingLinksPromise,
  ]);

  return {
    props: {
      preLinks: preLinksCateRes.data.data.links,
      preCategory: preLinksCateRes.data.data.category,
      preTrendingLinks: trendingLinksRes.data.data.links,
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
