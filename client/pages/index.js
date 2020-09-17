import styles from "../styles/pages/Home.module.scss";
import Link from "next/link";

import axios from "../utils/axios";
import { API } from "../config";

const Home = ({ categories }) => {
  console.log(categories);
  return (
    <div className={styles["home"]}>
      <div className={styles["home__leadbox"]}>
        <h1 className={styles["home__leadbox__heading"]}>
          Discover the best software & web development tutorial's.
        </h1>
        <h2 className={styles["home__leadbox__subheading"]}>
          - Contributed by the <span>devs community</span>.
        </h2>
      </div>
      <div className={styles["home__categories"]}>
        {categories.map((cate) => (
          <div key={cate._id} className={styles["home__categories__item"]}>
            <Link href={`/cateogries/${cate.slug}`}>
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
