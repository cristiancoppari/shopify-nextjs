"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn, createUrl } from "~/lib/utils";
import { SortFilterItem as TSortFilterItem } from "~/lib/constants";

import { ListItem, PathFilterItem as TPathFilterItem } from ".";

function PathFilterItem({ item }: { item: TPathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicElTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="mt-2" key={item.title}>
      <DynamicElTag
        href={item.path}
        className={cn("w-full text-sm underline-offset-4 hover:underline", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicElTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: TSortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug }),
    }),
  );
  const DynamicElTag = active ? "p" : Link;

  return (
    <li className="mt-2" key={item.title}>
      <DynamicElTag
        prefetch={!active ? false : undefined}
        href={href}
        className={cn("w-full text-sm underline-offset-4 hover:underline", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicElTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
