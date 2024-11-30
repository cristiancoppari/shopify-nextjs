import { getPage } from "~/lib/shopify";
import OpenGraphImage from "~/components/opengraph-image";

export const runtime = "edge";

export default async function Image({ params }: { params: Promise<{ page: string }> }) {
  const paramsStore = await params;
  const page = await getPage(paramsStore.page);
  const title = page.seo?.title || page.title;

  return await OpenGraphImage({ title });
}
