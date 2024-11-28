import { ProductGrid } from "~/components/products/product-grid";
import { defaultSort, sorting } from "~/lib/constants";
import { getCollectionProducts } from "~/lib/shopify";

type SearchParams = { [key: string]: string | string[] | undefined };
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: SearchParams;
}) {
  const parameters = (await params) as { collection: string };
  const { sort } = (await searchParams) as SearchParams;
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ collection: parameters.collection, sortKey, reverse });

  return (
    <section>
      {products.length ? <ProductGrid items={products} /> : <p>No products found in this collection</p>}
    </section>
  );
}
