import Link from "next/link";

import { restrictToAdmin } from "../../utils/auth";
import styles from "../../styles/pages/admin.module.scss";

const Admin = () => {
  return (
    <div className={styles["_wrapper"]}>
      <h1 className={styles["_title"]}>Admin Dashboard</h1>
      <div className={styles["_actions"]}>
        <Link href="/admin/category/create">
          <a className={styles["_actions__item"]}>Create category</a>
        </Link>
        <Link href="/admin/category">
          <a className={styles["_actions__item"]}>Manage categories</a>
        </Link>
        <Link href="/admin/links">
          <a className={styles["_actions__item"]}>Manage Resources</a>
        </Link>
      </div>
      <div className=""></div>
    </div>
  );
};

export default Admin;

export const getServerSideProps = async (ctx) => {
  return await restrictToAdmin(ctx);
};
