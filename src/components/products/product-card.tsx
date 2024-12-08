import Image from "next/image";
import Link from "next/link";

import type { Product } from "~/lib/shopify/types";
import { Card, CardContent } from "~/components/ui/card";

export function ProductCard({ title, handle, featuredImage, priceRange, description }: Product) {
  return (
    <Link href={`/product/${handle}`}>
      <Card className="overflow-hidden border-none shadow-none">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={featuredImage.url}
              alt={title}
              fill
              className="rounded-lg object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="pt-2">
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="mt-1 text-sm font-medium text-gray-600">{description.split(" ").slice(0, 3).join(" ")}</p>
            )}
            <p className="tex-base mt-1 font-semibold">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: priceRange.maxVariantPrice.currencyCode,
              }).format(parseFloat(priceRange.maxVariantPrice.amount))}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
