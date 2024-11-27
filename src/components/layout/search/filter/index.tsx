import { SortFilterItem } from "~/lib/constants";

import { FilterItem } from "./item";

export type PathFilterItem = {
  title: string;
  path: string;
};
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <>
      <nav>
        {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
        <ul className="hidden flex-col gap-4 md:block">
          <FilterItemList list={list} />
        </ul>
        {/* <ul className="md:hidden">
          <FilterItemDropdown list={list} />
        </ul> */}
      </nav>
    </>
  );
}
