import { useState, Fragment } from "react";

import axios from "../../../utils/axios";
import { API } from "../../../config";
import Modal from "../../../components/Modal";
import UpdateLink from "../../../components/UpdateLink";
import { restrictToAdmin, getCookieFromServerReq } from "../../../utils/auth";
import Loader from "../../../components/Loader";
import LinkCard from "../../../components/LinkCard";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import styles from "../../../styles/pages/adminLinks.module.scss";

const LIMIT = 2;

const Links = ({ preLinks, preCategories }) => {
  const [links, setLinks] = useState(preLinks);
  const [selectedUpdateLink, setSelectedUpdateLink] = useState(null);
  const [selectedDeleteLink, setSelectedDeleteLink] = useState(null);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      prevLinksLength.current = links.length;
      const res = await axios.get(
        `${API}/v1/links?limit=${LIMIT}&skip=${numLinksToSkip.current}`
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

  // Increase view count
  const handleIncreseView = async (url) => {
    try {
      const res = await axios.patch(`${API}/v1/links/views/increase`, { url });
      const modifiedLink = res.data.data.link;
      setLinks((prev) =>
        prev.map((link) =>
          link._id === modifiedLink._id ? modifiedLink : link
        )
      );
    } catch (error) {
      console.error(error);
    }
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
        <h1 className={styles["_wrapper__title"]}>Manage Resources</h1>
        <div className={styles["_inner"]}>
          {/* Map User's links */}
          <ul className={styles["_inner__links"]}>
            {links.map((link, idx) => (
              <LinkCard
                ref={idx + 1 === links.length ? lastNodeRef : undefined}
                key={link._id}
                link={link}
                enableEdit
                onSelectUpdate={() => setSelectedUpdateLink(link)}
                onSelectDelete={() => setSelectedDeleteLink(link)}
                isAdmin
                onIncreaseView={handleIncreseView}
              />
            ))}
          </ul>
          <div className={styles["_inner__loadingBox"]}>
            {isLoading && <Loader />}
            {links.length - prevLinksLength.current < LIMIT && (
              <p>All resources have been displayed.</p>
            )}
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
  const authResult = await restrictToAdmin(ctx);

  const skip = 0;

  // Get all links posted by user
  const token = getCookieFromServerReq(ctx.req, "AUTH_TOKEN");
  const res = await axios.get(`${API}/v1/links?limit=${LIMIT}&skip=${skip}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

export default Links;
