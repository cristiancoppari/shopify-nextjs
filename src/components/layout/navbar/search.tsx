"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { Input } from "~/components/ui/input";
import { createUrl } from "~/lib/utils";

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
    <form onSubmit={onSubmit}>
      <Input
        name="search"
        key={searchParams?.get("q")}
        placeholder="Search"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
      />
      <button type="submit">Search</button>
    </form>
  );
}
