"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search as IconSearch } from "lucide-react";

import { Input } from "~/components/ui/input";
import { createUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";

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
        placeholder="Buscá un producto"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
      />
      <Button type="submit" variant={"secondary"}>
        <IconSearch />
      </Button>
    </form>
  );
}
