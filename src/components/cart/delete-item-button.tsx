"use client";

import { XIcon } from "lucide-react";
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
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
