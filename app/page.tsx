// import LoaderLink from "@/components/nav/custom-link";
// import AbstractArt from "@/components/graphics/abstract-image";
// import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-4  max-w-xl">
      <h1 className="text-5xl sm:text-7xl font-bold text-center"> 
   خوش آمدید به وبلاگ{" "}<span className="primary-color">آتریپا</span>
      </h1>
      <div className="flex justify-center">
        <p>
        یک قالب ساده وبلاگ استاتیک که با Next.js و MDX ساخته شده است.</p>
      </div>
      <div className="flex justify-center py-3">
        <Link target="_blank" href="https://github.com/owolfdev/mdx-blog">
          <Button>
            <div className="text-lg">
              نصب{" "}
              <span className="font-bold">
                وبلاگ{" "}<span className="">آتریپا</span>
              </span>
            </div>
          </Button>
        </Link>
      </div>
      <p>
      برای رفتن به github MDXBlog repository روی دکمه بالا کلیک کنید ☝️. دستورالعمل نصب در{" "}
        <Link
          target="_blank"
          href="https://github.com/owolfdev/mdx-blog/blob/main/README.md"
        >
          README
        </Link>{" "}
        file.
      </p>
      <hr />
      <p>
      ما به طور منظم محتوا، از جمله مقالات، آموزش ها و اخبار را منتشر می کنیم.
      </p>
      <div className="flex justify-center py-3 pb-6">
        {" "}
        <Link className="text-lg" href="/blog">
          <Button>
            <span className="text-lg">شروع به خواندن کنید</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
