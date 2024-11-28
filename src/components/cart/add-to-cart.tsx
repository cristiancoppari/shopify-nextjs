"use client";

import { useActionState } from "react";
import { ShoppingCart } from "lucide-react";

import type { Product } from "~/lib/shopify/types";
import { useProduct } from "~/context/product-context";
import { Button } from "~/components/ui/button";
import useCart from "~/context/cart-context";
import { addItem } from "~/actions/cart-actions";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  if (!availableForSale)
    return (
      <Button type="submit" disabled>
        Out of stock
      </Button>
    );

  if (!selectedVariantId)
    return (
      <Button type="submit">
        Add to cart <ShoppingCart className="ml-2" />
      </Button>
    );

  return (
    <Button type="submit">
      Add to cart <ShoppingCart className="ml-2" />
    </Button>
  );
}

export default function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()]),
  );
  const defaultVariantId = variants.length === 1 ? variants[0].id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

  if (!finalVariant) {
    return (
      <Button type="submit" disabled>
        Unavailable
      </Button>
    );
  }

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        await actionWithVariant();
      }}
    >
      <SubmitButton availableForSale={availableForSale} selectedVariantId={selectedVariantId} />

      {message && <p>{message.message}</p>}
    </form>
  );
}
