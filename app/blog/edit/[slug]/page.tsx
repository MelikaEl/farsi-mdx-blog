import React from "react";
import { EditPostForm } from "./edit-post-form";
import { getPost } from "@/lib/posts-utils.mjs";

async function EditBlog({ params }: { params: { slug: string } }) {
 //decode encode
 // const decodedSlug = decodeURIComponent(params.slug);
 // const postData = await getPost({ slug: decodedSlug });
 const postData = await getPost(params);

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
          ویرایش پست
        </h1>
        <EditPostForm postData={postData} />
      </div>
    </div>
  );
}

export default EditBlog;
