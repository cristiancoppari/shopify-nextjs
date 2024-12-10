import type { Product } from "~/lib/shopify/types";
import Price from "~/components/ui/price";
import Prose from "~/components/prose";

import AddToCart from "../cart/add-to-cart";

import VariantSelector from "./variant-selector";

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6">
        <h2 className="mb-2 mt-4 text-balance text-3xl font-medium md:mb-4 md:mt-0 md:text-5xl">{product.title}</h2>

        <div className="mr-auto flex w-auto flex-row gap-2 text-xl md:text-2xl">
          <Price
            className={
              product.compareAtPriceRange?.maxVariantPrice?.amount &&
              product.compareAtPriceRange?.maxVariantPrice?.amount !== "0.0"
                ? "text-lg text-neutral-500 line-through"
                : ""
            }
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
          {product.compareAtPriceRange?.maxVariantPrice?.amount &&
            product.compareAtPriceRange?.maxVariantPrice?.amount !== "0.0" && (
              <>
                <Price
                  className="ml-4"
                  amount={product.compareAtPriceRange.maxVariantPrice.amount}
                  currencyCode={product.compareAtPriceRange.maxVariantPrice.currencyCode}
                />
                <span className="text-base text-green-600">
                  {(() => {
                    const originalPrice = Number(product.priceRange.maxVariantPrice.amount);
                    const salePrice = Number(product.compareAtPriceRange.maxVariantPrice.amount);
                    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
                    return `${discount}% OFF`;
                  })()}
                </span>
              </>
            )}
        </div>
      </div>

      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml && <Prose className="leading-light mb-6 text-sm" html={product.descriptionHtml} />}

      <AddToCart product={product} />
    </>
  );
}
