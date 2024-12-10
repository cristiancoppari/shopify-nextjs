"use client";

import { XIcon, TrashIcon } from "lucide-react";
import { useActionState } from "react";

import { CartItem } from "~/lib/shopify/types";

import { removeItem } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DeleteItemButton({ item, optimisticUpdate }: { item: CartItem; optimisticUpdate: any }) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        await actionWithVariant();
      }}
    >
      <button type="submit" aria-label="Remove cart item" className="flex p-1">
        <TrashIcon className="h-4 w-4 text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
