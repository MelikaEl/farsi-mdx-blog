import { CreatePostForm } from "./create-post-form";

export default function Admin() {
  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
        ایجاد یک پست
        </h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
