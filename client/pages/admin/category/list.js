import React from "react";

import axios from "../../../utils/axios";
import { API } from "../../../config";
import { restrictToAdmin } from "../../../utils/auth";
import styles from "../../../styles/pages/listCategories.module.scss";

const list = ({ preCategories }) => {
  return (
    <div className={styles["_container"]}>
      <h1>List categories</h1>
    </div>
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
