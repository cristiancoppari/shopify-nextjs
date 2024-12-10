export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const SHOPIFY_GRAQPHQL_API_ENDPOINT = "/api/2024-10/graphql.json";

export type SortFilterItem = {
  title: string;
  slug: string;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};
export const defaultSort: SortFilterItem = {
  title: "Ordenar por: Relevancia",
  slug: "relevance-asc",
  sortKey: "RELEVANCE",
  reverse: false,
};
export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: "Populares", slug: "trending-asc", sortKey: "BEST_SELLING", reverse: false },
  { title: "Nuevos arrivos", slug: "latest-desc", sortKey: "CREATED_AT", reverse: true },
  { title: "Precio: ascendente", slug: "price-asc", sortKey: "PRICE", reverse: false },
  { title: "Precio: descendente", slug: "price-desc", sortKey: "PRICE", reverse: true },
];

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
