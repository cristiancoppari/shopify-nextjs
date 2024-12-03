import type { Metadata } from "next";

import { Hero } from "~/components/custom/hero";
import { Grid } from "~/components/products/grid";
import { getProducts } from "~/lib/shopify";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

const HERO = {
  title: "Title",
  subtitle: "Subtitle",
};

export default async function Home() {
  const products = await getProducts({
    first: 4,
  });
  return (
    <main>
      <Hero {...HERO} />

      <div className="container mx-auto px-4 py-8">
        <Grid items={products} />
      </div>
    </main>
  );
}
