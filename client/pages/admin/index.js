import withAdminAuth from "../../components/withAdminAuth";
import Link from "next/link";

const Admin = () => {
  return (
    <div className="">
      <h1>Admin Dashboard</h1>
      <div className="">
        <Link href="/admin/category/create">
          <a>Create category</a>
        </Link>
      </div>
      <div className=""></div>
    </div>
  );
};

export default withAdminAuth(Admin);
