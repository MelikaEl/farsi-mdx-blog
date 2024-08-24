"use client"
import { useState } from "react";
import { CreatePostForm } from "./create-post-form";

export default function Admin() {
  const [markdown, setMarkdown] = useState<string>("");
  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
         ایجاد پست
        </h1>
        <CreatePostForm markdown={markdown}/>
      </div>
    </div>
  );
}





