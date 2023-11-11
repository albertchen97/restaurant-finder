// _app.tsx - Next.js
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Restaurant Finder</title>
        {/* <h1>Headstarter Yelp Case</h1> */}
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
