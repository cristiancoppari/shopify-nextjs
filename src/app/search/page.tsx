import { defaultSort, sorting } from "~/lib/constants";
import { getProducts } from "~/lib/shopify";
import { ProductGrid } from "~/components/products/product-grid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { sort, q: searchValue } = (await searchParams) as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0 ? "No products found" : `Showing ${products.length} ${resultsText} for`}
        </p>
      ) : null}

      {products.length > 0 ? <ProductGrid items={products} /> : <p className="mb-4">No products found</p>}
    </>
  );
}
