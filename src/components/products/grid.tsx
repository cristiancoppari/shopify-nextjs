import type { Product } from "~/lib/shopify/types";
import { ProductCard } from "~/components/products/product-card";

export function Grid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.length ? items.map((item, i) => <ProductCard key={i} {...item} />) : "No products found"}
    </div>
  );
}
