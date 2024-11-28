import type { Product } from "~/lib/shopify/types";
import Price from "~/components/ui/price";
import Prose from "~/components/prose";

import AddToCart from "../cart/add-to-cart";

import VariantSelector from "./variant-selector";

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6">
        <h2 className="mb-2 text-5xl font-medium">{product.title}</h2>

        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
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
