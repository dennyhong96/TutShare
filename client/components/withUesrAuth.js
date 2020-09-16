import axios from "../utils/axios";
import { getCookieFromServerReq } from "../utils/auth";
import { API } from "../config";

const withUserAuth = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;

  // getInitialProps IS Executed on the server first
  // then executed on client
  WithAuthUser.getInitialProps = async ({ req, res }) => {
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
      return {};
    } else {
      console.log("USER IS AUTHORIZED");
      // Wait for Page's getInitialProps to resolve and merge the results
      // This is being returned to WithAuthUser's props, then being spread into Page's props
      return {
        ...(Page.getInitialProps
          ? await Page.getInitialProps({ req, res })
          : {}),
      };
    }
    // getInitialProps must return an object, each key is accessable in props
    // Will not render page untill something is returned
  };

  return WithAuthUser;
};

export default withUserAuth;
