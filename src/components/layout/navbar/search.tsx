"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search as IconSearch } from "lucide-react";
import { Metadata } from "next";

import { Input } from "~/components/ui/input";
import { createUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for products",
};

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/search", newParams));
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        name="search"
        key={searchParams?.get("q")}
        placeholder="Search"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
      />
      <Button type="submit" variant={"ghost"}>
        <IconSearch />
      </Button>
    </form>
  );
}
