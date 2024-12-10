"use client";

import { useActionState } from "react";
import { PlusIcon } from "lucide-react";

import type { Product } from "~/lib/shopify/types";
import { useProduct } from "~/context/product.context";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/cart.context";
import { addItem } from "~/components/cart/actions";

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
        Agregar <PlusIcon />
      </Button>
    );

  return (
    <Button type="submit">
      Agregar <PlusIcon />
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
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((variant) => variant.id === selectedVariantId);

  const actionWithVariant = formAction.bind(null, selectedVariantId);

  if (!finalVariant) {
    return (
      <Button type="submit" disabled>
        Selecciona una opción
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
