import type { Metadata } from "next";

import { Hero } from "~/components/custom/hero";
import { ProductsNewArrivalsGrid } from "~/components/products/products-new-arrivals-grid";
import { CollectionGrid } from "~/components/collections/collection-grid";
import { BenefitsSection } from "~/components/custom/benefits";

export const metadata: Metadata = {
  title: "Inicio - Tu marca aquí",
  description: "Tu marca aquí",
};

export default async function Home() {
  return (
    <main>
      <Hero />
      <BenefitsSection />
      <CollectionGrid />
      <ProductsNewArrivalsGrid />
    </main>
  );
}
