import { Html, Head, Main, NextScript } from "next/document";

// Sets up the HTMl template for Nextjs pages
// Imports Poppins font from Google Fonts
// This is the recommended structure and best practice from the Next.js team
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@600&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
