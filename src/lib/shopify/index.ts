import type { Menu, ShopifyMenuOperation } from "./types";

import { SHOPIFY_GRAQPHQL_API_ENDPOINT, TAGS } from "~/lib/constants";
import { getMenuQuery } from "~/lib/shopify/queries/menu";

import { ensureStartsWith } from "../utils";
import { isShopifyError } from "../type-guards";

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
