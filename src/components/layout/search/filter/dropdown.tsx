"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { FilterItem } from "~/components/layout/search/filter/item";

import { ListItem } from ".";

export default function Dropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  /**
   * TODO: move to a hook
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    list.forEach((item: ListItem) => {
      if (("path" in item && item.path === pathname) || ("slug" in item && searchParams.get("sort") === item.slug)) {
        setActive(item.title);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm"
      >
        {active}
        <ChevronDown className="h-4 w-4" />
      </div>

      {openSelect && (
        <div onClick={() => setOpenSelect(false)} className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md">
          {list.map((item, i) => {
            return (
              <li className="mt-2" key={item.title}>
                <FilterItem item={item} key={i} />
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}
