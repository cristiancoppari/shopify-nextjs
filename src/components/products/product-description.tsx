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

        <div className="mr-auto w-auto text-xl md:text-2xl">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml && <Prose className="leading-light mb-6 text-sm" html={product.descriptionHtml} />}

      <AddToCart product={product} />
    </>
  );
}
