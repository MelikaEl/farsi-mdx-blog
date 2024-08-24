"use client";

import React, { useState, useEffect } from "react";

import { generatePostsCache } from "@/lib/posts-utils.mjs";

import DatePickerField from "@/components/date-picker";

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

import dynamic from "next/dynamic"; //for SSR renndering in Editor component
import {
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  InsertImage,
  imagePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import Editor from "@/components/mdx-editor"; // Import the isolated MDXEditor component


interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>; //This line defines a prop called editorRef with a specific TypeScript type. Let's examine each part:editorRef?:The ? after editorRef indicates that this prop is optional. It means that when using the component, you don't have to provide this prop if you don't need it.React.MutableRefObject:This is a type provided by React for mutable refs.Mutable refs are used to hold a mutable value that persists for the full lifetime of the component.<MDXEditorMethods | null>:This is a generic type parameter for MutableRefObject.It specifies that the ref can hold either an object of type MDXEditorMethods or null.The | symbol represents a union type, meaning it can be one type or the other.MDXEditorMethods:This is likely an interface or type defined by the MDXEditor library. It probably contains methods that can be called on the editor instance, such as focusing the editor, getting or setting content, etc.
}


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

export function CreatePostForm({ markdown, editorRef }: EditorProps) {
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

      // Reset the form heref
      form.reset();

      router.push(`/blog/${result}`); // Redirect to the blog page

      // Handle success scenario (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error:", error);
      // Handle error scenario (e.g., show an error message)
    }
  }

  const MDXEditor = dynamic(
    () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
    { ssr: false }
  );


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
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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
              <FormLabel className="font-semibold text-md">تاریخ انتشار</FormLabel>
              <DatePickerField field={field} />
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
              <Editor
                  initialContent={form.watch("content")}
                  onContentChange={(value) => form.setValue("content", value)}
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
                <Input placeholder="برچسب ها را وارد کنید (با کاما از هم جدا باشند)" {...field} />
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










