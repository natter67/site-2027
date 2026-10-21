import { Fragment } from "react";
import Head from "next/head";

export default function Content({ title, metaTitle, children, wide }) {
  return (
    <Fragment>
      <Head>
        <title>{metaTitle || title}</title>
        <link rel="icon" href="/eoh2026.ico" />
      </Head>
      <main className={`text-center flex flex-col justify-center w-10/12 ${wide ? "lg:max-w-7xl" : "lg:max-w-4xl"} mx-auto mt-36 lg:mt-32`}>
        {title &&
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl uppercase leading-none mb-5 md:mb-8 lg:mb-10 text-center text-da-navy p-2"
          >
            {title}
          </h1>}
        {children}
      </main>
    </Fragment>
  );
}
