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
  title: "Sort by: Relevance",
  slug: "relevance-asc",
  sortKey: "RELEVANCE",
  reverse: false,
};
export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: "Trending", slug: "trending-asc", sortKey: "BEST_SELLING", reverse: false },
  { title: "Latest arrivals", slug: "latest-desc", sortKey: "CREATED_AT", reverse: true },
  { title: "Price: Low to high", slug: "price-asc", sortKey: "PRICE", reverse: false },
  { title: "Price: High to low", slug: "price-desc", sortKey: "PRICE", reverse: true },
];

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
