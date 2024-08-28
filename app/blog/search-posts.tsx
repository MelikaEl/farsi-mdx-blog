"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState, useCallback, useEffect, useRef, use } from "react";
import React from "react";
import debounce from "lodash/debounce";


const SearchPosts = ({
  currentPage,
  limit,
  numBlogs,
  sort,
}: {
  currentPage: number;
  limit: number;
  numBlogs: number;
  sort: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setInputValue(search);
  }, [searchParams]);

  const searchForTerm = useCallback(
    (searchTerm: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newSearchParams.set("search", searchTerm);
      } else {
        newSearchParams.delete("search");
      }
      newSearchParams.set("page", "1"); // Reset to first page on new search
      router.push(`/blog?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setInputValue(searchTerm);
    searchForTerm(searchTerm);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchForTerm(inputValue);
  };

  return (
    <div className="flex gap-2 items-center w-1/2 sm:w-2/3 ">
      <div className="icon-container">
        <MagnifyingGlassIcon className="w-[24px] h-[24px]" />
      </div>{" "}
      <form onSubmit={handleSubmit}>
        <div className="w-full">
        <Input
            ref={inputRef}
            type="text"
            name="searchTerm"
            placeholder="جستجو"
            value={inputValue}
            onChange={handleChange}
            className="text-lg sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchPosts;
