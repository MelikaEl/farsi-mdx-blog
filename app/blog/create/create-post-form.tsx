"use client";

import React, { useState, useEffect } from "react";

import { generatePostsCache } from "@/lib/posts-utils.mjs";

//import DatePickerField from "@/components/date-picker";

//import { Calendar } from "react-multi-date-picker";
//import persian from "react-date-object/calendars/persian";
//import persian_fa from "react-date-object/locales/persian_fa";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

//import DatePicker from "react-multi-date-picker"
//import favorite_calendar from "react-date-object/calendars/persian
//import react-date-object/locales/persian_fa

// import { useUser } from "@clerk/nextjs";

import { v4 as uuidv4 } from "uuid";

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

import { useRouter } from "next/navigation";

import "react-multi-date-picker/styles/colors/green.css"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import { useTheme } from "next-themes";

const formSchema = z.object({
  date: z.date(), // Make dob optional
  type: z.string().optional(),
  title: z.string().min(3, {
    message: "عنوان باید حداقل 2 کاراکتر باشد.",
  }),
  author: z.string().min(3, {
    message: "نویسنده باید حداقل 3 کاراکتر داشته باشد.",
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

export function CreatePostForm() {
  const [selectedValue, setSelectedValue] = useState("blog");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: "blog",
      title: "",
      author: "",
      description: "",
      content: "",
      categories: ["توسعه وب"],
      tags: "",
    },
  });

  // const { user } = useUser(); // Retrieve user information
  const authorName = "O Wolfson"; // Replace 'fullName' with the appropriate field
  //const { theme } = useTheme();
  const router = useRouter();

  // useEffect(() => {
  //   console.log("user:", user);
  // }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Endpoint URL where you want to send the POST request
    const endpoint = "/api/save-file-locally"; // Replace with your actual API route

    console.log("values!!!!!!!!!!!!!:", values);

    // Add the author data to the submission values
    const submissionData = {
      ...values,
      id: uuidv4(),
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

      router.push(`/blog/${result}`); // Redirect to the blog page

      // Handle success scenario (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error:", error);
      // Handle error scenario (e.g., show an error message)
    }
  }

  const direction = "rtl";
  const { theme } = useTheme();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع پست</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel className="font-semibold text-md">
                تاریخ انتشار
              </FormLabel>

              <div  style={{ direction: "rtl" }} >
                <DatePicker
                  // className="bg-dark"
                 className= {theme === 'dark' ? 'bg-dark , green': 'green'} 
                  inputClass={theme === 'dark' ? 'dark-custom-input': 'custom-input'}
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

              {/*<DatePickerField field={field} />*/}

              {/*<DatePicker />*/}
              {/*<Calendar calendar={persian} locale={persian_fa} />*/}

              {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* title */}
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
        {/* author */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نویسنده</FormLabel>
              <FormControl>
                <Input placeholder="نویسنده" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
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
        <Button type="submit">ایجاد</Button>
      </form>
    </Form>
  );
}
