import type { Product } from "~/lib/shopify/types";

import { ProductCard } from "./product-card";

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-6 text-2xl font-bold">Our Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <ProductCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
