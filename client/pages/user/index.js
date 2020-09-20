import { restrictToUser } from "../../utils/auth";
import { getCookieFromServerReq } from "../../utils/auth";
import { useSelector } from "react-redux";
import Link from "next/link";

import LinkCard from "../../components/LinkCard";
import axios from "../../utils/axios";
import { API } from "../../config";
import styles from "../../styles/pages/user.module.scss";

const User = ({ preLinks }) => {
  console.log(preLinks);
  const user = useSelector(({ user: { user } }) => user);
  return (
    <div className={styles["_wrapper"]}>
      <h1 className={styles["_wrapper__title"]}>Welcome back, {user.name}!</h1>
      <div className={styles["_inner"]}>
        <div className={styles["_inner__left"]}>
          <div className={styles["_inner__left__inner"]}>
            {/* Display user actions */}
            <Link href="/link/create">
              <a className={styles["_inner__left__action"]}>
                <i class="fas fa-share-alt"></i>Share a resource
              </a>
            </Link>
            <Link href="/user">
              <a className={styles["_inner__left__action"]}>
                <i class="fas fa-user"></i>Update profile
              </a>
            </Link>
          </div>
        </div>
        <div className={styles["_inner__right"]}>
          <div className={styles["_inner__right__inner"]}>
            {/* Map User's links */}
            <ul id="links-container">
              {links.map((link, idx) => (
                <LinkCard
                  ref={idx + 1 === links.length ? lastNode : undefined}
                  key={link._id}
                  link={link}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const authResult = await restrictToUser(ctx);

  // Get all links posted by user
  const token = getCookieFromServerReq(ctx.req, "AUTH_TOKEN");
  const res = await axios.get(`${API}/v1/links/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    ...authResult,
    props: {
      ...authResult.props,
      preLinks: res.data.data.links,
    },
  };
};

export default User;
