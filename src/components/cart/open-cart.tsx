import { ShoppingCartIcon } from "lucide-react";
import clsx from "clsx";

import { buttonVariants } from "~/components/ui/button";

export default function OpenCart({ quantity }: { className?: string; quantity?: number }) {
  return (
    <div className={clsx(buttonVariants(), "relative")}>
      <ShoppingCartIcon />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 flex h-4 w-4 items-center justify-center rounded bg-blue-600 text-[11px] font-medium text-white">
          <span>{quantity}</span>
        </div>
      ) : null}
    </div>
  );
}
