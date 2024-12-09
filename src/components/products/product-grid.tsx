import type { Product } from "~/lib/shopify/types";
import { Grid } from "~/components/products/grid";

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-6 text-2xl font-bold">Productos</h2>

      <Grid items={items} />
    </div>
  );
}
