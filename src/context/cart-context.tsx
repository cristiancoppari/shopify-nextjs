"use client";

import { use, useContext, createContext, useOptimistic, useMemo } from "react";

import type { Cart, CartItem, Product, ProductVariant } from "~/lib/shopify/types";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart | undefined;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: {
        merchandiseId: string;
        updateType: UpdateType;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        variant: ProductVariant;
        product: Product;
      };
    };

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    lines: [],
    totalQuantity: 0,
    cost: {
      subtotalAmount: {
        amount: "0",
        currencyCode: "ARS",
      },
      totalAmount: {
        amount: "0",
        currencyCode: "ARS",
      },
      totalTaxAmount: {
        amount: "0",
        currencyCode: "ARS",
      },
    },
  };
}

function calculateItemCost(quantity: number, price: string) {
  return (Number(price) * quantity).toString();
}

function updateCartItem(item: CartItem, updateType: UpdateType): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity = updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount.toString());

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function updateCartTotals(lines: CartItem[]): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce((acc, item) => acc + Number(item.cost.totalAmount.amount), 0);
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "ARS";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: {
        amount: totalAmount.toString(),
        currencyCode,
      },
      totalAmount: {
        amount: totalAmount.toString(),
        currencyCode,
      },
      totalTaxAmount: {
        amount: "0",
        currencyCode,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);
  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: product.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) => (item.merchandise.id === merchandiseId ? updateCartItem(item, updateType) : item))
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0)
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: {
              ...currentCart.cost.totalAmount,
              amount: "0.00",
            },
          },
        };

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find((item) => item.merchandise.id === variant.id);
      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);
      const updatedLines = existingItem
        ? currentCart.lines.map((item) => (item.merchandise.id === variant.id ? updatedItem : item))
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, setOptimisticCart] = useOptimistic(initialCart, cartReducer);

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    setOptimisticCart({
      type: "UPDATE_ITEM",
      payload: {
        merchandiseId,
        updateType,
      },
    });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    setOptimisticCart({
      type: "ADD_ITEM",
      payload: {
        variant,
        product,
      },
    });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}
