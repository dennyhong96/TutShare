import styles from "../styles/pages/Home.module.scss";
import Link from "next/link";

import axios from "../utils/axios";
import { API } from "../config";

const Home = ({ categories }) => {
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
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await axios.get(`${API}/v1/categories`);
  return {
    revalidate: 1,
    props: {
      categories: res.data.data.categories,
    },
  };
};

export default Home;
