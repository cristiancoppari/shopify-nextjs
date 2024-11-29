"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import { addToCart } from "~/lib/shopify";
import { TAGS } from "~/lib/constants";

export async function addItem(prevState: unknown, selectedVariantId: string | undefined) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId || !selectedVariantId) return { message: "Cart not found" };

  try {
    await addToCart(cartId, [{ merchandiseId: selectedVariantId, quantity: 1 }]);

    revalidateTag(TAGS.cart);
  } catch (error) {
    console.error(error);
    return {
      message: "Error adding item to cart",
    };
  }
}
