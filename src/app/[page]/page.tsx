import { Metadata } from "next";
import { notFound } from "next/navigation";

import Prose from "~/components/prose";
import { getPage } from "~/lib/shopify";

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const paramsStore = await params;
  const page = await getPage(paramsStore.page);

  if (!page) notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const paramsStore = await params;
  const urlParams = paramsStore.page;
  const page = await getPage(urlParams);

  if (!page) notFound();

  return (
    <>
      <h1>{page.title}</h1>

      <Prose className="mb-8" html={page.body as string} />

      <p>
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(page.updatedAt))}`}
      </p>
    </>
  );
}
