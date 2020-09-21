import { useState } from "react";
import Link from "next/link";

import axios from "../utils/axios";
import { API } from "../config";
import LinkCard from "../components/LinkCard";
import styles from "../styles/pages/home.module.scss";

const Home = ({ categories, trendingResources }) => {
  const [resources, setResources] = useState(trendingResources);

  const handleIncreaseView = async (url) => {
    try {
      const res = await axios.patch(`${API}/v1/links/views/increase`, { url });
      console.log(res.data);
      setResources((prev) =>
        prev.map((rc) => (rc.url === url ? res.data.data.link : rc))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles["home"]}>
      <div className={styles["home__leadbox"]}>
        <h1 className={styles["home__leadbox__heading"]}>
          Discover the best web development learning resources.
        </h1>
        <h2 className={styles["home__leadbox__subheading"]}>
          - Shared by the{" "}
          <a
            href="https://twitter.com/hashtag/DevCommunity"
            target="_blank"
            rel="noopener noreferrer"
          >
            dev community
          </a>{" "}
          with ♥️
        </h2>
      </div>
      <div className={styles["home__categories"]}>
        {categories.map((cate) => (
          <div key={cate._id} className={styles["home__categories__item"]}>
            <Link href={`/categories/${cate.slug}`}>
              <a className={styles["home__categories__card"]}>
                <img src={cate.image.url} alt={cate.name} />
                <p>{cate.name}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className={styles["home__trending"]}>
        <h1 className={styles["home__trending__title"]}>
          Trending Resourses 🔥
        </h1>
        <ul className={styles["home__trending__resources"]}>
          {resources.map((rc) => (
            <LinkCard
              link={rc}
              onIncreaseView={() => handleIncreaseView(rc.url)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const [categoryRes, resourceRes] = await Promise.all([
    axios.get(`${API}/v1/categories`),
    axios.get(`${API}/v1/links/popular`),
  ]);

  return {
    revalidate: 1,
    props: {
      categories: categoryRes.data.data.categories,
      trendingResources: resourceRes.data.data.links,
    },
  };
};

export default Home;
