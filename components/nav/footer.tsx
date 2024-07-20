import Link from "next/link";

export function Footer() {
  return (
    <footer className=" bottom-0 z-40 w-full border-t bg-background p-6 ">
      <div className="sm:px-8 px-4 flex flex-col justify-between items-center h-16 space-y-4 sm:space-y-0">
        <div className="flex gap-6 items-center">
          <div className="">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-bold">وبلاگ آتریپا</span> ایجاد شده توسط {" "}
            <Link target="_blank" href="https://owolf.com">
              ملیکا اعلامی
            </Link>
          </div>
        </div>
        <nav className="flex gap-4 items-center text-sm">
          <Link href="/">صفحه اصلی</Link>
          <Link href="/blog">وبلاگ</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/privacy">حریم خصوصی</Link>
        </nav>
      </div>
    </footer>
  );
}
