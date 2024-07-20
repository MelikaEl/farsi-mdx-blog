import CachePostsButton from "@/components/admin/cache-posts-button";
import OpenCategoriesInVSCode from "./open-categories-in-vs-code";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-center">تنظیمات</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Link href="/admin">
            <Button>مدیریت</Button>
          </Link>
          <p className="text-sm text-muted-foreground">مدیریت داده های پست ها</p>
        </div>
        <div className="flex flex-col gap-2">
          <CachePostsButton />
          <p className="text-sm text-muted-foreground">
          پست‌های حافظه پنهان پس از ویرایش دستی یک پست در VS Code یا سایر ویرایشگرهای متنی ذخیره می‌شوند. ذخیره‌سازی در حافظه پنهان، فهرست وبلاگ و قابلیت‌های جستجو را به‌روزرسانی می‌کند.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <OpenCategoriesInVSCode />
          <p className="text-sm text-muted-foreground">
          دسته ها در یک فایل پیکربندی JSON ذخیره می شوند. این دکمه آن فایل را در VS Code برای ویرایش باز می کند.
          </p>
        </div>
      </div>
    </div>
  );
}
