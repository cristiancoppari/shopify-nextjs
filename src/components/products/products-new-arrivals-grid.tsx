import { getProducts } from "~/lib/shopify";
import { Grid } from "~/components/products/grid";
import Title from "~/components/typography/title";
import Paragraph from "~/components/typography/paragraph";

export async function ProductsNewArrivalsGrid() {
  const products = await getProducts({
    sortKey: "RELEVANCE",
    reverse: true,
    first: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto mb-4 flex flex-col gap-2 px-4 py-8 text-center">
        <Title as="h2" size={"h3"}>
          Nuevos productos
        </Title>
        <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, unde.</Paragraph>
      </div>

      <Grid items={products} />
    </div>
  );
}
