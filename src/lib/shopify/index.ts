import type {
  Connection,
  Menu,
  Image,
  Product,
  ShopifyMenuOperation,
  ShopifyProduct,
  ShopifyProductsOperation,
  Collection,
  ShopifyCollectionsOperation,
  ShopifyCollection,
  ShopifyCollectionProductsOperation,
  ShopifyProductOperation,
  Cart,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyProductRecommendationsOperation,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifyPageOperation,
  Page,
  ShopifyPagesOperation,
} from "~/lib/shopify/types";
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAQPHQL_API_ENDPOINT, TAGS } from "~/lib/constants";
import { ensureStartsWith } from "~/lib/utils";
import { isShopifyError } from "~/lib/type-guards";
import { getMenuQuery } from "~/lib/shopify/queries/menu";
import { getProductQuery, getProductRecommendationsQuery, getProductsQuery } from "~/lib/shopify/queries/products";
import { getCartQuery } from "~/lib/shopify/queries/cart";

import { getCollectionsQuery, getCollectionsProductsQuery } from "./queries/collections";
import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "./mutations/cart";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getPageQuery, getPagesQuery } from "./queries/page";

const domain = process.env.SHOPIFY_STORE_DOMAIN ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://") : "";
const endpoint = `${domain}${SHOPIFY_GRAQPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ExtractVariables<T> = T extends { variables: object } ? T["variables"] : never;

export async function shopifyFetch<T>({
  cache = "force-cache",
  query,
  variables,
  tags,
  headers,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
        cache,
        ...(tags && {
          next: {
            tags,
          },
        }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    if (isShopifyError(error)) {
      throw JSON.stringify(
        {
          cause: error.cause?.toString() || "unknown",
          status: error.status || 500,
          message: error.message,
          query,
        },
        null,
        2,
      );
    }

    throw JSON.stringify(
      {
        error,
        query,
      },
      null,
      2,
    );
  }
}

function reshapeImages(images: Connection<Image>, productTitle: string) {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
}

export function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

function reshapeProduct(product: ShopifyProduct, filterHiddenProducts: boolean = true) {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) return;

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
}

function reshapeCollection(collection: ShopifyCollection): Collection | undefined {
  if (!collection) return;

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
}

function reshapeCollections(collections: ShopifyCollection[]) {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
}

function reshapeCart(cart: ShopifyCart): Cart {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: "ARS",
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
}

export function reshapeProducts(products: ShopifyProduct[]) {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const response = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
    },
  });

  return (
    response.body?.data?.menu?.items.map((item: { title: string; url: string }) => {
      return {
        title: item.title,
        path: item.url.replace(domain, "").replace("/collections", "/search").replace("/pages", "").replace("/all", ""),
      };
    }) || []
  );
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProducts({
  sortKey,
  reverse,
  query,
}: {
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      sortKey,
      reverse,
      query,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res.body.data.collections);

  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All products",
        description: "All products",
      },
      updatedAt: new Date().toISOString(),
      path: "/search",
    },
    // Filter out hidden products
    ...reshapeCollections(shopifyCollections.filter((collection) => !collection.handle.startsWith("hidden"))),
  ];

  return collections;
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse,
}: {
  collection: string;
  sortKey: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionsProductsQuery,
    tags: [TAGS.products, TAGS.collections],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.error("collection not found");
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
}

export async function addToCart(
  cartId: string,
  lines: {
    merchandiseId: string;
    quantity: number;
  }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-cache",
  });

  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  if (!cartId) return;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    tags: [TAGS.cart],
    variables: {
      cartId,
    },
  });

  // old carts becomes 'null' when you checkout
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function revalidate(request: NextRequest): Promise<NextResponse> {
  const collectionWebhooks = ["collections/create", "collections/update", "collections/delete"];
  const productWebhooks = ["products/create", "products/update", "products/delete"];
  const headersStore = await headers();
  const topic = headersStore.get("x-shopify-topic") || "unknown";
  const secret = request.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json("Invalid secret", { status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything from any other topics
    return NextResponse.json("Invalid topic", { status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    cache: "no-store",
    variables: {
      handle,
    },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: "no-store",
  });

  return removeEdgesAndNodes(res.body.data.pages);
}
