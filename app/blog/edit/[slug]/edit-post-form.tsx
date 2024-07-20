"use client";

import React, { useState, useEffect } from "react";

import { parseISO } from "date-fns";

import { useRouter } from "next/navigation";



//import DatePickerField from "@/components/date-picker";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";



import { format } from "date-fns";

// import CachePostsButton from "@/components/admin/cache-posts-button";

import { generatePostsCache } from "@/lib/posts-utils.mjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MultiSelect } from "@/components/rs-multi-select";

const formSchema = z.object({
  date: z.date(),
  type: z.string().optional(),
  title: z.string().min(3, {
    message: "عنوان باید حداقل 2 کاراکتر باشد.",
  }),
  description: z.string().min(15, {
    message: "توضیحات باید حداقل 15 کاراکتر باشد.",
  }),
  content: z.string().min(2, {
    message: "محتوا باید حداقل 2 کاراکتر باشد.",
  }),
  categories: z.array(z.string()).nonempty(),
  tags: z.string().optional(),
});

export function EditPostForm({ postData }: { postData: any }) {
  const [selectedValue, setSelectedValue] = useState("blog");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: postData.frontMatter.date
        ? parseISO(postData.frontMatter.date)
        : new Date(),
      type: postData.frontMatter.type,
      title: postData.frontMatter.title,
      description: postData.frontMatter.description,
      content: postData.content.trim(),
      categories: postData.frontMatter.categories,
      tags: postData.frontMatter.tags
        ? postData.frontMatter.tags.join(", ")
        : "",
    },
  });

  // Retrieve user information

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Endpoint URL where you want to send the POST request
    const endpoint = "/api/edit-file-locally"; // Replace with your actual API route

    const formattedDate = values.date ? format(values.date, "yyyy-MM-dd") : "";

    // Add the author data to the submission values
    const submissionData = {
      ...values,
      author: postData.frontMatter.author,
      id: postData.frontMatter.id,
      savedFilename: postData.frontMatter.path,
      date: formattedDate,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      // Reset the form here
      form.reset();

      const slug = postData.frontMatter.path.replace(/\.mdx$/, "");

      //redirect to the post page
      router.push(`/blog/${slug}`);
      router.refresh();

      // Handle success scenario (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error:", error);
      // Handle error scenario (e.g., show an error message)
    }
  }

  const handleOpenInVSCode = async () => {
    fetch("/api/open-in-vs-code", {
      method: "POST",
      body: JSON.stringify(`data/posts/${postData.frontMatter.path}`),
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/settings");
  };

  const handleDeletePost = async () => {
    await fetch("/api/delete-post", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await fetch("/api/cache-posts", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    router.push("/blog");
    router.refresh();
    console.log("delete post");
  };


  const direction = "rtl" ;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع پست</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]" dir={direction}>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent dir={direction}>
                    <SelectItem value="blog">وبلاگ</SelectItem>
                    <SelectItem value="project">پروژه</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold text-md">تاریخ</FormLabel>
                <div style={{ direction: "rtl" }}>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                />
              </div>
                
                
                
                {/*<DatePickerField field={field} />*/}



                {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان پست</FormLabel>
                <FormControl>
                  <Input placeholder="عنوان" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شرح</FormLabel>
                <FormControl>
                  <Textarea placeholder="شرح" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>محتوا</FormLabel>
                <FormControl>
                  <Textarea
                    id="content"
                    className="h-[300px]"
                    placeholder="محتوا"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* categories - multi-select */}
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>دسته بندی ها</FormLabel>
                <FormControl>
                  <MultiSelect
                    selectedCategories={field.value}
                    setSelectedCategories={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>برچسب ها</FormLabel>
                <FormControl>
                  <Input
                    placeholder="برچسب ها را وارد کنید (با کاما از هم جدا باشند)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Button type="submit">ذخیره ویرایش ها</Button>
            <Button type="button" onClick={handleOpenInVSCode}>
            فایل را در VS Code باز کنید
            </Button>
          </div>
        </form>
      </Form>
      {/* <CachePostsButton /> */}
      <Dialog >
        <DialogTrigger asChild>
          <div>
            <Button
              variant="destructive"
              type="button"
              // onClick={handleDeletePost}
            >
              حذف پست
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" >
          <DialogHeader >
            <DialogTitle >حذف پست</DialogTitle>
            <DialogDescription >
            آیا مطمئن هستید که می خواهید پست فعلی را حذف کنید؟
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4"></div>
          <DialogFooter>
            <div className="w-full flex gap-4">
              <Button variant="destructive" onClick={handleDeletePost}>
              حذف پست
              </Button>
              <DialogClose className="bg-gray-300 text-black px-4 py-2 rounded">
                <span className="text-sm">انصراف</span>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <div>{JSON.stringify(postData.frontMatter)}</div> */}
    </>
  );
}
