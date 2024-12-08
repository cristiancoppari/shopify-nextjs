import { getCollections } from "~/lib/shopify";
import { Grid } from "~/components/products/grid";
import Title from "~/components/typography/title";
import Paragraph from "~/components/typography/paragraph";

export async function CollectionGrid() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container mx-auto mb-4 flex flex-col gap-2 px-4 py-8 text-center">
        <Title as="h2" size={"h3"}>
          Colecciones
        </Title>
        <Paragraph>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, unde.</Paragraph>
      </div>

      <Grid items={collections} cols={3} />
    </div>
  );
}
