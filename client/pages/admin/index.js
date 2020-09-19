import Link from "next/link";

import { restrictToAdmin } from "../../utils/auth";

const Admin = () => {
  return (
    <div className="">
      <h1>Admin Dashboard</h1>
      <div className="">
        <Link href="/admin/category/create">
          <a>Create category</a>
        </Link>
        <Link href="/admin/category/list">
          <a>List categories</a>
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
