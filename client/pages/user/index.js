import { restrictToUser } from "../../utils/auth";

const User = () => {
  return <p>Hello</p>;
};

export const getServerSideProps = async (ctx) => {
  return await restrictToUser(ctx);
};

export default User;
