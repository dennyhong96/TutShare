// import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";

import store from "../redux/store";
import Layout from "../components/Layout";
import InterestPopup from "../components/InterestPopup";
import "../styles/globals.scss";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ReduxProvider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {process.browser && <InterestPopup />}
    </ReduxProvider>
  );
};

export default MyApp;
