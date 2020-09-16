import axios from "../utils/axios";
import { getCookieFromServerReq } from "../utils/auth";
import { API } from "../config";

const withAdminAuth = (Page) => {
  const WithAdminAuth = (props) => <Page {...props} />;

  WithAdminAuth.getInitialProps = async ({ req, res }) => {
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
      console.log("USER IS NOT AUTHORIZED FOR ADMIN ROUTE, REDIRECTING TO '/'");
      // Redirect to Home page on server side
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
      return {};
    } else {
      console.log("ADMIN IS AUTHORIZED");
      // Wait for Page's getInitialProps to resolve and merge the results
      // This is being returned to WithAdminAuth's props, then being spread into Page's props
      return {
        ...(Page.getInitialProps
          ? await Page.getInitialProps({ req, res })
          : {}),
      };
    }
  };

  return WithAdminAuth;
};

export default withAdminAuth;
