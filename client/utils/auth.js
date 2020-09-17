import axios from "./axios";
import { API } from "../config";

/**
 * Extracts Cookie value from getInitialProps req object from context
 * @param {object} req - getInitialProps req object from context
 * @param {string} cookieKey - Key of the cookie that is being extracted
 * @returns {string} cookie value
 */
export const getCookieFromServerReq = (req, cookieKey) => {
  return req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${cookieKey}=`))
    .split(`${cookieKey}=`)[1];
};

export const restrictToAdmin = async ({ req, res }) => {
  let isAuthorized;

  try {
    let token;

    if (!process.browser) {
      // Running on server
      token = getCookieFromServerReq(req, "AUTH_TOKEN");
    }

    await axios.get(`${API}/v1/auth/admin`, {
      headers: {
        // If running on client, token is provided from cookies
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    isAuthorized = true;
  } catch (error) {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    console.log("USER IS NOT AUTHORIZED FOR ADMIN ROUTE, REDIRECTING TO '/'");
    // Redirect to Home page on server side
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return {
      props: {}, // Add other initialProps from WithAdminAuth
    };
  } else {
    console.log("ADMIN IS AUTHORIZED");
    // Wait for Page's getInitialProps to resolve and merge the results
    // This is being returned to WithAdminAuth's props, then being spread into Page's props
    return {
      props: {
        isAuthorized, // Add other initialProps from WithAdminAuth
      },
    };
  }
};

export const restrictToUser = async ({ req, res }) => {
  let isAuthorized;

  try {
    let token;

    if (!process.browser) {
      // Running on server
      token = getCookieFromServerReq(req, "AUTH_TOKEN");
    }

    await axios.get(`${API}/v1/auth/user`, {
      headers: {
        // If running on client, token is provided from cookies
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    isAuthorized = true;
  } catch (error) {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    console.log("ADMIN IS NOT AUTHORIZED FOR USER ROUTE, REDIRECTING TO '/'");
    // Redirect to Home page on server side
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return {
      props: {}, // Add other initialProps from WithAdminAuth
    };
  } else {
    console.log("USER IS AUTHORIZED");
    // Wait for Page's getInitialProps to resolve and merge the results
    // This is being returned to WithAdminAuth's props, then being spread into Page's props
    return {
      props: {
        isAuthorized, // Add other initialProps from WithAdminAuth
      },
    };
  }
};
