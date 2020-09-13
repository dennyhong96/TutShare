import styles from "../styles/Home.module.scss";

import Layout from "../components/Layout";

const Home = () => {
  return (
    <div className={styles.container}>
      <Layout>
        <h1>Hello</h1>
      </Layout>
    </div>
  );
};

export default Home;
