"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { Product } from "~/lib/shopify/types";

import { ProductCard } from "./product-card";

export function ProductsCarousel({ items }: { items: Product[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  return (
    <div className="embla rounded-xl" data-carousel="products" ref={emblaRef}>
      <div className="embla__container">
        {items.map((item, i) => (
          <div key={i} className="embla__slide">
            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
