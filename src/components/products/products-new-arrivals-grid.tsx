import { getProducts } from "~/lib/shopify";
import { Grid } from "~/components/products/grid";
import Title from "~/components/typography/title";

export async function ProductsNewArrivalsGrid() {
  const products = await getProducts({
    sortKey: "RELEVANCE",
    reverse: true,
    first: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto mb-4 flex flex-col gap-2 px-4 py-8 text-center">
        <Title>Nuevos productos</Title>
        <Title as="p" size={"h4"}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, unde.
        </Title>
      </div>

      <Grid items={products} />
    </div>
  );
}
