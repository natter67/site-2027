import { Fragment } from "react";
import Head from "next/head";
import PageHeader from "@/page-header";
import RelatedLinks from "@/related-links";

// Inner-page template: page header (breadcrumbs, section eyebrow, title, summary, optional
// "On this page"), the page content, then related links from the same menu section.
// onThisPage: [{ id, label }] for longer pages. related={false} hides the related links.
export default function Content({ title, metaTitle, children, wide, summary, onThisPage, related = true }) {
  return (
    <Fragment>
      <Head>
        <title>{metaTitle || title}</title>
        <link rel="icon" href="/eoh2027.ico" />
      </Head>
      <main className={`text-center flex flex-col justify-center w-10/12 ${wide ? "lg:max-w-7xl" : "lg:max-w-4xl"} mx-auto mt-24 lg:mt-[120px]`}>
        {title && <PageHeader title={title} summary={summary} onThisPage={onThisPage} />}
        {children}
        {related && <RelatedLinks />}
      </main>
    </Fragment>
  );
}
