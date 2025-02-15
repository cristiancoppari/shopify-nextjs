import Image from "next/image";
import Link from "next/link";

import type { Collection } from "~/lib/shopify/types";
import { Card, CardContent } from "~/components/ui/card";

export function CollectionCard({ title, handle, image, description }: Collection) {
  // this way I filter the all collection if I don't add the image
  if (!image) return null;

  return (
    <Link href={`//${handle}`}>
      <Card className="overflow-hidden border-none shadow-none">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={image.url}
              alt={title}
              fill
              className="rounded-lg object-cover transition-transform hover:scale-105"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="pt-2">
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="mt-1 text-sm font-medium text-gray-600">{description.split(" ").slice(0, 3).join(" ")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
