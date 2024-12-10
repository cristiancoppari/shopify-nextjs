"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { useCart } from "~/context/cart.context";
import { createUrl } from "~/lib/utils";
import Price from "~/components/ui/price";
import OpenCart from "~/components/cart/open-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { DEFAULT_OPTION } from "~/lib/constants";

import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { DeleteItemButton } from "./delete-item-button";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export function Cart() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (cart?.totalQuantity && cart?.totalQuantity !== quantityRef.current && cart?.totalQuantity > 0) {
      if (!isOpen) {
        setIsOpen(true);
      }

      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <OpenCart quantity={cart?.totalQuantity} />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Carrito</SheetTitle>
        </SheetHeader>
        {/* <SheetDescription>Este es tu carrito de compras. Puedes agregar o quitar productos.</SheetDescription> */}
        {!cart || cart.lines.length === 0 ? (
          <div>
            <p className="mt-6">Tu carrito esta vacío.</p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ScrollArea className="flex-grow">
              <ul>
                {cart.lines
                  .sort((a, b) => a.merchandise.product.title.localeCompare(b.merchandise.product.title))
                  .map((item, i) => {
                    const merchandiseSearchParams = {} as MerchandiseSearchParams;

                    item.merchandise.selectedOptions.forEach(({ name, value }) => {
                      if (value !== DEFAULT_OPTION) {
                        merchandiseSearchParams[name.toLocaleLowerCase()] = value;
                      }
                    });
                    const merchandiseUrl = createUrl(
                      `/product/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams),
                    );

                    return (
                      <li
                        key={i}
                        className="relative flex w-full flex-col border-b border-neutral-300 py-3 dark:border-neutral-700"
                      >
                        <div className="absolute right-2 top-2 z-10 flex flex-row justify-between">
                          <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_4fr]">
                          <div className="relative hidden w-full overflow-hidden rounded-md border border-neutral-300 md:block">
                            <Image
                              className="h-full w-full object-cover"
                              width={64}
                              height={64}
                              alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                              src={item.merchandise.product.featuredImage.url}
                            />
                          </div>
                          <div className="mr-2">
                            <Link href={merchandiseUrl} onClick={closeCart} className="z-30 flex flex-row space-x-4">
                              <div className="flex flex-1 flex-col text-base">
                                <span className="font-base max-w-[200px] truncate leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.merchandise.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2 rounded-lg border p-1">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  variant="ghost"
                                  optimisticUpdate={updateCartItem}
                                />
                                <span className="text-sm">{item.quantity}</span>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  variant="ghost"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="hidden md:flex md:flex-col md:items-end">
                                <span className="text-sm text-zinc-500">$/unidad</span>
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm"
                                  amount={item.merchandise.product.priceRange.maxVariantPrice.amount}
                                  currencyCode={item.merchandise.product.priceRange.maxVariantPrice.currencyCode}
                                />
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-zinc-500">Total</span>
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm font-semibold"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={item.cost.totalAmount.currencyCode}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </ScrollArea>
            <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Impuestos</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.cost.totalTaxAmount.amount}
                  currencyCode={cart.cost.totalTaxAmount.currencyCode}
                />
              </div>
              <div className="mb-3 flex items-center justify-between gap-x-2 border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Envío</p>
                <p className="truncate text-right">Calculados al momento de la compra</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Total</p>
                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={cart.cost.totalAmount.amount}
                  currencyCode={cart.cost.totalAmount.currencyCode}
                />
              </div>
            </div>
            <form
              action={() => {
                redirectToCheckout();
              }}
              className="mb-10"
            >
              <CheckoutButton />
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Cargando..." : "Finalizar compra"}
    </Button>
  );
}
