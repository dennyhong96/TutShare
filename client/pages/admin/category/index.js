import React, { Fragment, useState } from "react";
import Link from "next/link";
import moment from "moment";

import Modal from "../../../components/Modal";
import axios from "../../../utils/axios";
import { API } from "../../../config";
import { restrictToAdmin } from "../../../utils/auth";
import styles from "../../../styles/pages/listCategories.module.scss";

const list = ({ preCategories }) => {
  const [categories, setCategories] = useState(preCategories);
  const [selectedCate, setSelectedCate] = useState(null);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${API}/v1/categories/${selectedCate.slug}`
      );
      console.log(res.data);
      setCategories((prev) => prev.filter((cate) => cate.slug !== slug));
    } catch (error) {
      console.error(error);
    }
    setSelectedCate(null);
  };

  return (
    <Fragment>
      <div className={styles["_container"]}>
        <h1 className={styles["_container__title"]}>Category List</h1>
        <div className={styles["_container__inner"]}>
          <table className={styles["_container__table"]}>
            <thead>
              <tr>
                <th className={styles["_container__table__firstCol"]}>Name</th>
                <th>Image</th>
                <th>Posted By</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Update</th>
                <th className={styles["_container__table__lastCol"]}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cate) => (
                <tr key={cate._id}>
                  <td className={styles["_container__table__firstCol"]}>
                    {cate.name}
                  </td>
                  <td>
                    <img
                      className={styles["_container__table__image"]}
                      src={cate.image.url}
                      alt={cate.name}
                    />
                  </td>
                  <td>{cate.postedBy.name}</td>
                  <td>{moment(cate.createdAt).format("MMM Do YY")}</td>
                  <td>{moment(cate.updatedAt).format("MMM Do YY")}</td>
                  <td>
                    <Link href={`/admin/category/update/${cate.slug}`}>
                      <a className={styles["_container__table__button-update"]}>
                        <i className="fas fa-pen-alt"></i>
                      </a>
                    </Link>
                  </td>
                  <td className={styles["_container__table__lastCol"]}>
                    <button
                      onClick={() => setSelectedCate(cate)}
                      className={styles["_container__table__button-delete"]}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        show={!!selectedCate}
        onHide={() => setSelectedCate(null)}
        style={{ width: "20rem" }}
      >
        <div className={styles["_container__modalInner"]}>
          <p className={styles["_container__modalInner__prompt"]}>
            Are your sure you want to delete {selectedCate?.name} ?
          </p>
          <button
            onClick={handleDelete}
            className={styles["_container__modalInner__delete"]}
          >
            Delete
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export const getServerSideProps = async (ctx) => {
  const authResult = await restrictToAdmin(ctx);
  const res = await axios.get(`${API}/v1/categories`);
  return {
    ...authResult,
    props: {
      ...authResult.props,
      preCategories: res.data.data.categories,
    },
  };
};

export default list;
