import { MinusIcon, PlusIcon } from "lucide-react";
import { useActionState } from "react";

import { Button, type ButtonProps } from "~/components/ui/button";
import { CartItem } from "~/lib/shopify/types";

import { updateItemQuantity } from "./actions";

function SubmitButton({ type, variant = "default" }: { type: "plus" | "minus"; variant?: ButtonProps["variant"] }) {
  return (
    <Button
      type="submit"
      aria-label={type === "plus" ? "Increase item quantity" : "Reduce item quantity"}
      variant={variant}
      size="sm"
    >
      {type === "plus" ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
    </Button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
  variant,
}: {
  item: CartItem;
  type: "plus" | "minus";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimisticUpdate: any;
  variant?: ButtonProps["variant"];
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const actionWithVariant = formAction.bind(null, payload);
  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        await actionWithVariant();
      }}
    >
      <SubmitButton type={type} variant={variant} />
      <p aria-label="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
