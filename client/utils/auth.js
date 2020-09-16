import axios from "./axios";

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
