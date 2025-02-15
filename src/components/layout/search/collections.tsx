import { Suspense } from "react";

import { getCollections } from "~/lib/shopify";
import FilterList from "~/components/layout/search/filter";
import { cn } from "~/lib/utils";

async function CollectionList() {
  const collections = await getCollections();

  return <FilterList list={collections} title="Colecciones" />;
}

export default function Collections() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CollectionList />
    </Suspense>
  );
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800";
const items = "bg-neutral-400";

function Skeleton() {
  return (
    <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
      <div className={cn(skeleton, activeAndTitles)} />
      <div className={cn(skeleton, activeAndTitles)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
      <div className={cn(skeleton, items)} />
    </div>
  );
}
