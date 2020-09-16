import React from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/router";

import { getCookieFromServerReq } from "../../utils/auth";
import { API } from "../../config";

const User = ({ isAuthorized }) => {
  if (process.browser) {
    const router = useRouter();
    if (!isAuthorized) {
      router.replace("/");
    }
  }

  return <p>Hello</p>;
};

export default User;

// Executed in the server for 1st load, client for subsequence loads
User.getInitialProps = async ({ req, res }) => {
  try {
    let token;

    if (!process.browser) {
      // Running on server
      token = getCookieFromServerReq(req, "AUTH_TOKEN");
    }

    console.log("TOKEN", token);

    await axios.get(`${API}/v1/auth/user`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return { isAuthorized: true };
  } catch (error) {
    // console.error("CLIENT error", error);
    return { isAuthorized: false };
  }
  // Must return an object, each key is accessable in props
  // Will not render page untill something is returned
};
