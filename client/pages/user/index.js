import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

import Modal from "../../components/Modal";
import UpdateLink from "../../components/UpdateLink";
import { API } from "../../config";
import axios from "../../utils/axios";
import { restrictToUser, getCookieFromServerReq } from "../../utils/auth";
import Loader from "../../components/Loader";
import LinkCard from "../../components/LinkCard";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import styles from "../../styles/pages/user.module.scss";

const LIMIT = 2;

const User = ({ preLinks, preCategories }) => {
  const user = useSelector(({ user: { user } }) => user);
  const [links, setLinks] = useState(preLinks);
  const [selectedUpdateLink, setSelectedUpdateLink] = useState(null);
  const [selectedDeleteLink, setSelectedDeleteLink] = useState(null);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      prevLinksLength.current = links.length;
      const res = await axios.get(
        `${API}/v1/links/user?limit=${LIMIT}&skip=${numLinksToSkip.current}`
      );
      setLinks((prev) => [...prev, ...res.data.data.links]);
      numLinksToSkip.current += res.data.data.links.length;
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteLink = async () => {
    try {
      const res = await axios.delete(
        `${API}/v1/links/${selectedDeleteLink._id}`
      );
      console.log(res.data);
      setLinks((prev) => prev.filter((l) => l._id !== selectedDeleteLink._id));
      setSelectedDeleteLink(null);
    } catch (error) {
      console.error(error.response);
    }
  };

  // Update link list upon updated a link
  const handleLinkUpdated = (updatedLink) => {
    setLinks((prev) =>
      prev.map((link) => (link._id === updatedLink._id ? updatedLink : link))
    );
  };

  // Use Infinite Scroll
  const {
    lastNodeRef,
    numItemsToSkip: numLinksToSkip,
    prevItemsLength: prevLinksLength,
    isLoading,
    setLoading,
  } = useInfiniteScroll(links.length, LIMIT, handleLoadMore);

  return (
    <Fragment>
      <div className={styles["_wrapper"]}>
        <h1 className={styles["_wrapper__title"]}>
          Welcome back, {user.name}!
        </h1>
        <div className={styles["_inner"]}>
          <div className={styles["_inner__left"]}>
            <div className={styles["_inner__left__inner"]}>
              {/* Display user actions */}
              <Link href="/link/create">
                <a className={styles["_inner__left__action"]}>
                  <i className="fas fa-share-alt"></i>Share a resource
                </a>
              </Link>
              <Link href="/user">
                <a className={styles["_inner__left__action"]}>
                  <i className="fas fa-user"></i>Update profile
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
                    ref={idx + 1 === links.length ? lastNodeRef : undefined}
                    key={link._id}
                    link={link}
                    enableEdit
                    onSelectUpdate={() => setSelectedUpdateLink(link)}
                    onSelectDelete={() => setSelectedDeleteLink(link)}
                  />
                ))}
              </ul>
              <div className={styles["_inner__right__loadingBox"]}>
                {isLoading && <Loader />}
                {links.length - prevLinksLength.current < LIMIT && (
                  <p>All resources have been displayed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={!!selectedUpdateLink}
        onHide={() => setSelectedUpdateLink(null)}
      >
        {selectedUpdateLink && (
          <UpdateLink
            link={selectedUpdateLink}
            preCategories={preCategories}
            onLinkUpdated={handleLinkUpdated}
          />
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        show={!!selectedDeleteLink}
        onHide={() => setSelectedDeleteLink(null)}
        style={{ width: "20rem" }}
      >
        <div className={styles["_inner__delete"]}>
          <p className={styles["_inner__delete__prompt"]}>
            Are you sure you want to delete resource{" "}
            <span>"{selectedDeleteLink?.title}"</span> ?
          </p>
          <button
            className={styles["_inner__delete__button"]}
            onClick={handleDeleteLink}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  const authResult = await restrictToUser(ctx);

  const skip = 0;

  // Get all links posted by user
  const token = getCookieFromServerReq(ctx.req, "AUTH_TOKEN");
  const res = await axios.get(
    `${API}/v1/links/user?limit=${LIMIT}&skip=${skip}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Get all categories
  const cateRes = await axios.get(`${API}/v1/categories`);

  return {
    ...authResult,
    props: {
      ...authResult.props,
      preLinks: res.data.data.links,
      preCategories: cateRes.data.data.categories,
    },
  };
};

export default User;
