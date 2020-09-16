import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  render() {
    // _document.js is not a react component, it's the actual html page structure.
    // javascript logic in this file will never be executed on client side.
    return (
      <Html>
        <Head>
          <meta property="custom" content="Hello Next!" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
            integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          {/* Main component is what exported from _app.js */}
          <Main />
        </body>
        <NextScript />
      </Html>
    );
  }
}
