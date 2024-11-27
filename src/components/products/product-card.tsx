import Image from "next/image";
import Link from "next/link";

import type { Product } from "~/lib/shopify/types";
import { Card, CardContent } from "~/components/ui/card";

export function ProductCard({ title, handle, featuredImage, priceRange }: Product) {
  return (
    <Link href={`/product/${handle}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden rounded-md">
            <Image
              src={featuredImage.url}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <h3 className="mt-2 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {priceRange.maxVariantPrice.currencyCode} {priceRange.maxVariantPrice.amount}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
