// import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";

import store from "../redux/store";
import Layout from "../components/Layout";
import "../styles/globals.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ReduxProvider store={store}>
      <Layout>
        {/* <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
            integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
            crossOrigin="anonymous"
          />
        </Head> */}
        <Component {...pageProps} />
      </Layout>
    </ReduxProvider>
  );
};

export default MyApp;
