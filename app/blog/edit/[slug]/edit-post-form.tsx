"use client";

import React, { useState, useEffect } from "react";

import { parseISO } from "date-fns";

import { useRouter } from "next/navigation";

import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { format } from "date-fns";

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

import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";

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
  const [selectedDate, setSelectedDate] = useState(
    postData.frontMatter.date
      ? new DateObject(postData.frontMatter.date)
      : new DateObject()
  );

  const handleDateChange = (value: DateObject) => {
    setSelectedDate(value);
  };

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const endpoint = "/api/edit-file-locally";

    //const formattedDate = values.date ? format(values.date, "yyyy-MM-dd") : "";
    const formattedDate =
      selectedDate instanceof DateObject
        ? selectedDate.toDate().toISOString()
        : "";

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

      form.reset();

      const encodedSlug = encodeURIComponent(
        postData.frontMatter.path.replace(/\.mdx$/, "")
      );
      router.push(`/blog/${encodedSlug}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
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

  const direction = "rtl";
  const { theme } = useTheme();

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
                    value={selectedDate}
                    onChange={handleDateChange}
                    // className="bg-dark"
                    className={theme === "dark" ? "bg-dark , green" : "green"}
                    inputClass={
                      theme === "dark" ? "dark-custom-input" : "custom-input"
                    }
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    style={{
                      height: "40px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "3px 10px",
                    }}
                  />
                </div>
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
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <Button variant="destructive" type="button">
              حذف پست
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف پست</DialogTitle>
            <DialogDescription>
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
    </>
  );
}

//correct persain page
// "use client";

// import React, { useState, useEffect } from "react";

// import { parseISO } from "date-fns";

// import { useRouter } from "next/navigation";

// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// import { format } from "date-fns";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Textarea } from "@/components/ui/textarea";

// import { Input } from "@/components/ui/input";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { MultiSelect } from "@/components/rs-multi-select";

// import "react-multi-date-picker/styles/colors/green.css"
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
// import { useTheme } from "next-themes";

// const formSchema = z.object({
//   date: z.date(),
//   type: z.string().optional(),
//   title: z.string().min(3, {
//     message: "عنوان باید حداقل 2 کاراکتر باشد.",
//   }),
//   description: z.string().min(15, {
//     message: "توضیحات باید حداقل 15 کاراکتر باشد.",
//   }),
//   content: z.string().min(2, {
//     message: "محتوا باید حداقل 2 کاراکتر باشد.",
//   }),
//   categories: z.array(z.string()).nonempty(),
//   tags: z.string().optional(),
// });
// export function EditPostForm({ postData }: { postData: any }) {
//   const [selectedValue, setSelectedValue] = useState("blog");
//   const router = useRouter();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: postData.frontMatter.date
//         ? parseISO(postData.frontMatter.date)
//         : new Date(),
//       type: postData.frontMatter.type,
//       title: postData.frontMatter.title,
//       description: postData.frontMatter.description,
//       content: postData.content.trim(),
//       categories: postData.frontMatter.categories,
//       tags: postData.frontMatter.tags
//         ? postData.frontMatter.tags.join(", ")
//         : "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const endpoint = "/api/edit-file-locally";
//     const formattedDate = values.date ? format(values.date, "yyyy-MM-dd") : "";

//     const submissionData = {
//       ...values,
//       author: postData.frontMatter.author,
//       id: postData.frontMatter.id,
//       savedFilename: postData.frontMatter.path,
//       date: formattedDate,
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       console.log("Success:", result);

//       form.reset();

//       const encodedSlug = encodeURIComponent(
//         postData.frontMatter.path.replace(/\.mdx$/, "")
//       );
//       router.push(`/blog/${encodedSlug}`);
//       router.refresh();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   const handleOpenInVSCode = async () => {
//     fetch("/api/open-in-vs-code", {
//       method: "POST",
//       body: JSON.stringify(`data/posts/${postData.frontMatter.path}`),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     router.push("/settings");
//   };

//   const handleDeletePost = async () => {
//     await fetch("/api/delete-post", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     await fetch("/api/cache-posts", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     router.push("/blog");
//     router.refresh();
//     console.log("delete post");
//   };

//   const direction = "rtl";
//   const { theme } = useTheme();

//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>نوع پست</FormLabel>

//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="w-[180px]" dir={direction}>
//                       <SelectValue placeholder="Select post type" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent dir={direction}>
//                     <SelectItem value="blog">وبلاگ</SelectItem>
//                     <SelectItem value="project">پروژه</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* date */}
//           <FormField
//             control={form.control}
//             name="date"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel className="font-semibold text-md">تاریخ</FormLabel>
//                 <div  style={{ direction: "rtl" }} >
//                 <DatePicker
//                   // className="bg-dark"
//                  className= {theme === 'dark' ? 'bg-dark , green': 'green'}
//                   inputClass={theme === 'dark' ? 'dark-custom-input': 'custom-input'}
//                   calendar={persian}
//                   locale={persian_fa}
//                   calendarPosition="bottom-right"
//                   style={{
//                     height: "40px",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     padding: "3px 10px",
//                   }}
//                 />
//               </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>عنوان پست</FormLabel>
//                 <FormControl>
//                   <Input placeholder="عنوان" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>شرح</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="شرح" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>محتوا</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     id="content"
//                     className="h-[300px]"
//                     placeholder="محتوا"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//            {/* categories - multi-select */}
//           <FormField
//             control={form.control}
//             name="categories"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>دسته بندی ها</FormLabel>
//                 <FormControl>
//                   <MultiSelect
//                     selectedCategories={field.value}
//                     setSelectedCategories={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="tags"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>برچسب ها</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="برچسب ها را وارد کنید (با کاما از هم جدا باشند)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex gap-3">
//             <Button type="submit">ذخیره ویرایش ها</Button>
//             <Button type="button" onClick={handleOpenInVSCode}>
//               فایل را در VS Code باز کنید
//             </Button>
//           </div>
//         </form>
//       </Form>
//       <Dialog>
//         <DialogTrigger asChild>
//           <div>
//             <Button variant="destructive" type="button">
//               حذف پست
//             </Button>
//           </div>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>حذف پست</DialogTitle>
//             <DialogDescription>
//               آیا مطمئن هستید که می خواهید پست فعلی را حذف کنید؟
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4"></div>
//           <DialogFooter>
//             <div className="w-full flex gap-4">
//               <Button variant="destructive" onClick={handleDeletePost}>
//                 حذف پست
//               </Button>
//               <DialogClose className="bg-gray-300 text-black px-4 py-2 rounded">
//                 <span className="text-sm">انصراف</span>
//               </DialogClose>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";

// import { parseISO } from "date-fns";

// import { useRouter } from "next/navigation";

// //import DatePickerField from "@/components/date-picker";

// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// import { format } from "date-fns";

// // import CachePostsButton from "@/components/admin/cache-posts-button";

// import { generatePostsCache } from "@/lib/posts-utils.mjs";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";

// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Textarea } from "@/components/ui/textarea";

// import { Input } from "@/components/ui/input";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { MultiSelect } from "@/components/rs-multi-select";

// import "react-multi-date-picker/styles/colors/green.css";
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
// import { useTheme } from "next-themes";
// import { toJalaali, toGregorian } from "jalaali-js";
// import DateObject from "react-date-object";

// type JalaaliDateObject = {
//   year: number;
//   month: number;
//   day: number;
// };

// const formSchema = z.object({
//   date: z.instanceof(DateObject),
//   type: z.string().optional(),
//   title: z.string().min(3, {
//     message: "عنوان باید حداقل 2 کاراکتر باشد.",
//   }),
//   description: z.string().min(15, {
//     message: "توضیحات باید حداقل 15 کاراکتر باشد.",
//   }),
//   content: z.string().min(2, {
//     message: "محتوا باید حداقل 2 کاراکتر باشد.",
//   }),
//   categories: z.array(z.string()).nonempty(),
//   tags: z.string().optional(),
// });

// export function EditPostForm({ postData }: { postData: any }) {
//   const [selectedValue, setSelectedValue] = useState("blog");
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: postData.frontMatter.date
//         ? new DateObject({
//             date: postData.frontMatter.date,
//             calendar: persian,
//             locale: persian_fa,
//           })
//         : new DateObject({ calendar: persian, locale: persian_fa }),
//       type: postData.frontMatter.type,
//       title: postData.frontMatter.title,
//       description: postData.frontMatter.description,
//       content: postData.content.trim(),
//       categories: postData.frontMatter.categories,
//       tags: postData.frontMatter.tags
//         ? postData.frontMatter.tags.join(", ")
//         : "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const endpoint = "/api/edit-file-locally";

//     // Ensure values.date is of type DateObject
//     const dateObject: DateObject = values.date as DateObject;
//     console.log("dateObject",dateObject)

//     // Convert Persian date to Gregorian
//     let formattedDate = "";
//     if (dateObject) {
//       const gregorianDate = dateObject.convert(persian, persian_fa).toDate();
//       formattedDate = format(gregorianDate, "yyyy-MM-dd");
//     }

//     const submissionData = {
//       ...values,
//       author: postData.frontMatter.author,
//       id: postData.frontMatter.id,
//       savedFilename: postData.frontMatter.path,
//       date: formattedDate,
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       console.log("Success:", result);

//       form.reset();

//       const encodedSlug = encodeURIComponent(
//         postData.frontMatter.path.replace(/\.mdx$/, "")
//       );
//       router.push(`/blog/${encodedSlug}`);
//       router.refresh();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   const handleOpenInVSCode = async () => {
//     fetch("/api/open-in-vs-code", {
//       method: "POST",
//       body: JSON.stringify(`data/posts/${postData.frontMatter.path}`),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     router.push("/settings");
//   };

//   const handleDeletePost = async () => {
//     await fetch("/api/delete-post", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     await fetch("/api/cache-posts", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     router.push("/blog");
//     router.refresh();
//     console.log("delete post");
//   };

//   const direction = "rtl";
//   const { theme } = useTheme();

//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>نوع پست</FormLabel>

//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="w-[180px]" dir={direction}>
//                       <SelectValue placeholder="Select post type" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent dir={direction}>
//                     <SelectItem value="blog">وبلاگ</SelectItem>
//                     <SelectItem value="project">پروژه</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="date"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel className="font-semibold text-md">تاریخ</FormLabel>
//                 <div style={{ direction: "rtl" }}>
//                   <DatePicker
//                     value={field.value}
//                     onChange={(date) => field.onChange(date)}
//                     calendar={persian}
//                     locale={persian_fa}
//                     calendarPosition="bottom-right"
//                     format="YYYY/MM/DD"
//                     className={theme === "dark" ? "bg-dark , green" : "green"}
//                     inputClass={
//                       theme === "dark" ? "dark-custom-input" : "custom-input"
//                     }
//                     style={{
//                       height: "40px",
//                       borderRadius: "8px",
//                       fontSize: "14px",
//                       padding: "3px 10px",
//                     }}
//                   />
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>عنوان پست</FormLabel>
//                 <FormControl>
//                   <Input placeholder="عنوان" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>شرح</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="شرح" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>محتوا</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     id="content"
//                     className="h-[300px]"
//                     placeholder="محتوا"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="categories"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>دسته بندی ها</FormLabel>
//                 <FormControl>
//                   <MultiSelect
//                     selectedCategories={field.value}
//                     setSelectedCategories={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="tags"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>برچسب ها</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="برچسب ها را وارد کنید (با کاما از هم جدا باشند)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex gap-3">
//             <Button type="submit">ذخیره ویرایش ها</Button>
//             <Button type="button" onClick={handleOpenInVSCode}>
//               فایل را در VS Code باز کنید
//             </Button>
//           </div>
//         </form>
//       </Form>
//       <Dialog>
//         <DialogTrigger asChild>
//           <div>
//             <Button variant="destructive" type="button">
//               حذف پست
//             </Button>
//           </div>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>حذف پست</DialogTitle>
//             <DialogDescription>
//               آیا مطمئن هستید که می خواهید پست فعلی را حذف کنید؟
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4"></div>
//           <DialogFooter>
//             <div className="w-full flex gap-4">
//               <Button variant="destructive" onClick={handleDeletePost}>
//                 حذف پست
//               </Button>
//               <DialogClose className="bg-gray-300 text-black px-4 py-2 rounded">
//                 <span className="text-sm">انصراف</span>
//               </DialogClose>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";

// import { parseISO } from "date-fns";

// import { useRouter } from "next/navigation";

// //import DatePickerField from "@/components/date-picker";

// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// import { format } from "date-fns";

// // import CachePostsButton from "@/components/admin/cache-posts-button";

// import { generatePostsCache } from "@/lib/posts-utils.mjs";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";

// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Textarea } from "@/components/ui/textarea";

// import { Input } from "@/components/ui/input";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { MultiSelect } from "@/components/rs-multi-select";

// import "react-multi-date-picker/styles/colors/green.css";
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
// import { useTheme } from "next-themes";
// import { toJalaali, toGregorian } from "jalaali-js";
// import DateObject from "react-date-object";

// type JalaaliDateObject = {
//   year: number;
//   month: number;
//   day: number;
// };

// const formSchema = z.object({
//   date: z.instanceof(DateObject),
//   type: z.string().optional(),
//   title: z.string().min(3, {
//     message: "عنوان باید حداقل 2 کاراکتر باشد.",
//   }),
//   description: z.string().min(15, {
//     message: "توضیحات باید حداقل 15 کاراکتر باشد.",
//   }),
//   content: z.string().min(2, {
//     message: "محتوا باید حداقل 2 کاراکتر باشد.",
//   }),
//   categories: z.array(z.string()).nonempty(),
//   tags: z.string().optional(),
// });

// export function EditPostForm({ postData }: { postData: any }) {
//   const [selectedValue, setSelectedValue] = useState("blog");
//   const router = useRouter();

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: postData.frontMatter.date
//         ? new DateObject({
//             date: postData.frontMatter.date,
//             calendar: persian,
//             locale: persian_fa,
//           })
//         : new DateObject({ calendar: persian, locale: persian_fa }),
//       type: postData.frontMatter.type,
//       title: postData.frontMatter.title,
//       description: postData.frontMatter.description,
//       content: postData.content.trim(),
//       categories: postData.frontMatter.categories,
//       tags: postData.frontMatter.tags
//         ? postData.frontMatter.tags.join(", ")
//         : "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const endpoint = "/api/edit-file-locally";

//     // Ensure values.date is of type DateObject
//     const dateObject: DateObject = values.date as unknown as DateObject;

//     // Convert Persian date to Gregorian
//     let formattedDate = "";
//     if (dateObject) {
//       const jalaaliDate: JalaaliDateObject = {
//         year: dateObject.year,
//         month: dateObject.month.index + 1, // month.index is zero-based
//         day: dateObject.day,
//       };
//       const gregorianDate = toGregorian(
//         jalaaliDate.year,
//         jalaaliDate.month,
//         jalaaliDate.day
//       );
//       formattedDate = format(
//         new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd),
//         "yyyy-MM-dd"
//       );
//     }

//     const submissionData = {
//       ...values,
//       author: postData.frontMatter.author,
//       id: postData.frontMatter.id,
//       savedFilename: postData.frontMatter.path,
//       date: formattedDate,
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       console.log("Success:", result);

//       form.reset();

//       const encodedSlug = encodeURIComponent(
//         postData.frontMatter.path.replace(/\.mdx$/, "")
//       );
//       router.push(`/blog/${encodedSlug}`);
//       router.refresh();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   const handleOpenInVSCode = async () => {
//     fetch("/api/open-in-vs-code", {
//       method: "POST",
//       body: JSON.stringify(`data/posts/${postData.frontMatter.path}`),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     router.push("/settings");
//   };

//   const handleDeletePost = async () => {
//     await fetch("/api/delete-post", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     await fetch("/api/cache-posts", {
//       method: "POST",
//       body: JSON.stringify(postData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     router.push("/blog");
//     router.refresh();
//     console.log("delete post");
//   };

//   const direction = "rtl";
//   const { theme } = useTheme();

//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>نوع پست</FormLabel>

//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="w-[180px]" dir={direction}>
//                       <SelectValue placeholder="Select post type" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent dir={direction}>
//                     <SelectItem value="blog">وبلاگ</SelectItem>
//                     <SelectItem value="project">پروژه</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="date"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel className="font-semibold text-md">تاریخ</FormLabel>
//                 <div style={{ direction: "rtl" }}>
//                   <DatePicker
//                     value={field.value}
//                     onChange={(date) => field.onChange(date)}
//                     className={theme === "dark" ? "bg-dark , green" : "green"}
//                     inputClass={
//                       theme === "dark" ? "dark-custom-input" : "custom-input"
//                     }
//                     calendar={persian}
//                     locale={persian_fa}
//                     calendarPosition="bottom-right"
//                     style={{
//                       height: "40px",
//                       borderRadius: "8px",
//                       fontSize: "14px",
//                       padding: "3px 10px",
//                     }}
//                   />
//                 </div>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>عنوان پست</FormLabel>
//                 <FormControl>
//                   <Input placeholder="عنوان" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>شرح</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="شرح" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>محتوا</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     id="content"
//                     className="h-[300px]"
//                     placeholder="محتوا"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="categories"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>دسته بندی ها</FormLabel>
//                 <FormControl>
//                   <MultiSelect
//                     selectedCategories={field.value}
//                     setSelectedCategories={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="tags"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>برچسب ها</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="برچسب ها را وارد کنید (با کاما از هم جدا باشند)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex gap-3">
//             <Button type="submit">ذخیره ویرایش ها</Button>
//             <Button type="button" onClick={handleOpenInVSCode}>
//               فایل را در VS Code باز کنید
//             </Button>
//           </div>
//         </form>
//       </Form>
//       <Dialog>
//         <DialogTrigger asChild>
//           <div>
//             <Button variant="destructive" type="button">
//               حذف پست
//             </Button>
//           </div>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>حذف پست</DialogTitle>
//             <DialogDescription>
//               آیا مطمئن هستید که می خواهید پست فعلی را حذف کنید؟
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4"></div>
//           <DialogFooter>
//             <div className="w-full flex gap-4">
//               <Button variant="destructive" onClick={handleDeletePost}>
//                 حذف پست
//               </Button>
//               <DialogClose className="bg-gray-300 text-black px-4 py-2 rounded">
//                 <span className="text-sm">انصراف</span>
//               </DialogClose>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
