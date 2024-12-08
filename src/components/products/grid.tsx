import type { Collection, Product } from "~/lib/shopify/types";
import { ProductCard } from "~/components/products/product-card";
import { CollectionCard } from "~/components/collections/collection-card";
import { cn } from "~/lib/utils";

type Cols = 2 | 3 | 4;
export function Grid({ items, cols = 4 }: { cols?: Cols; items: Product[] | Collection[] }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2",
        cols === 4 && "md:grid-cols-3 lg:grid-cols-4",
        cols === 3 && "md:grid-cols-3 lg:grid-cols-3",
        cols === 2 && "md:grid-cols-2",
      )}
    >
      {items.length
        ? items.map((item) => {
            // Check if item is a Product by looking for a unique Product property
            if ("variants" in item) {
              return <ProductCard key={item.id} {...(item as Product)} />;
            }
            // Item is a Collection
            return <CollectionCard key={item.id} {...(item as Collection)} />;
          })
        : "No items found"}
    </div>
  );
}
