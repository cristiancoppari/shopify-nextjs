import type {
  Connection,
  Menu,
  Image,
  Product,
  ShopifyMenuOperation,
  ShopifyProduct,
  ShopifyProductsOperation,
} from "~/lib/shopify/types";
import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAQPHQL_API_ENDPOINT, TAGS } from "~/lib/constants";
import { getMenuQuery } from "~/lib/shopify/queries/menu";
import { ensureStartsWith } from "~/lib/utils";
import { isShopifyError } from "~/lib/type-guards";
import { getProductsQuery } from "~/lib/shopify/queries/products";

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
        path: item.url.replace(domain, "").replace("/collections", "/search").replace("/pages", ""),
      };
    }) || []
  );
}

export async function getProducts({
  sortKey,
  reverse,
  query,
}: {
  sortKey: string;
  reverse?: boolean;
  query: string;
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