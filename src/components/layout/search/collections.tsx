import { getCollections } from "~/lib/shopify";
import FilterList from "~/components/layout/search/filter";

async function CollectionList() {
  const collections = await getCollections();

  return <FilterList list={collections} title="Collections" />;
}

// const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
// const activeAndTitles = "bg-neutral-800";
// const items = "bg-neutral-400";

export default function Collections() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CollectionList />
    </div>
  );
}
