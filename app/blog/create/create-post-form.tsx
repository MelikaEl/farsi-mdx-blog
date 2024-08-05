"use client";

import React, { useState } from "react";

//import { generatePostsCache } from "@/lib/posts-utils.mjs";

//import DatePickerField from "@/components/date-picker";

//import { Calendar } from "react-multi-date-picker";
//import persian from "react-date-object/calendars/persian";
//import persian_fa from "react-date-object/locales/persian_fa";

import DatePicker, { DateObject } from "react-multi-date-picker";
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

import "react-multi-date-picker/styles/colors/green.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";

//import { Editor } from "react-draft-wysiwyg";
//import { EditorState } from "draft-js";
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import dynamic from "next/dynamic"; //for SSR renndering in Editor component

import type { ForwardedRef } from "react";

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
  imagePlugin
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

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

//const CreatePostForm: FC<EditorProps> = ({ markdown, editorRef }) => {
//export function CreatePostForm() {
export function CreatePostForm({ markdown, editorRef }: EditorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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

  //useref for Editor component in react-draft-wysiwyg. ref={setEditorReference} should be placed in Editor component.
  /*const editorRef = useRef<Editor | null>(null);

  const setEditorReference = (ref: Editor | null): void => {
    editorRef.current = ref;
  };

  const focusEditor = () => {
    if (editorRef.current) {
      // Approach 1: Using getEditorRef() if available
      const editor = (editorRef.current as any).getEditorRef?.();
      if (editor && typeof editor.focus === "function") {
        editor.focus();
        return;
      }

      // Approach 2: Accessing the DOM element directly
      const editorElement = (editorRef.current as any).editor;
      if (editorElement && typeof editorElement.focus === "function") {
        editorElement.focus();
        return;
      }

      // Approach 3: Finding the contenteditable div
      const editableElement = (
        editorRef.current as any
      ).editorContainer?.querySelector("[contenteditable=true]");
      if (editableElement && typeof editableElement.focus === "function") {
        editableElement.focus();
        return;
      }

      console.warn("Unable to focus the editor");
    }
  };

  // Example: Focus the editor when the component mounts
  useEffect(() => {
    focusEditor();
  }, []);*/

  //This approach ensures that the Editor component is only loaded and rendered in the browser, avoiding "window is not defined" errors in server-side environments. Server-Side Rendering (SSR) Challenges:When using React Draft Wysiwyg with frameworks that support server-side rendering (like Next.js), you may encounter "window is not defined" errors. This happens because the window object doesn't exist in a Node.js environment where the initial render occurs.Dynamic Import Solution:To overcome SSR issues, a common solution is to use dynamic imports. This ensures that the component is only loaded and rendered on the client side where the window object is available. To use React Draft Wysiwyg in SSR environments, you typically need to:Use dynamic imports to load the component only on the client side.Ensure that any code accessing window or browser-specific APIs is only executed in the browser environment.
  const MDXEditor = dynamic(
    () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
    { ssr: false }
  );

  /* const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );*/ // I add these states in my Editor component in my form

  //Add placeholder to the Editor component of react-draft-wysiwyg. The placeholder prop accepts a string value, which will be displayed when the editor is empty.The placeholder text will disappear as soon as the user starts typing or adds any content to the editor.You can customize the appearance of the placeholder text using CSS. The placeholder has a class of public-DraftEditorPlaceholder-root.Make sure you've imported the necessary CSS file for react-draft-wysiwyg to ensure proper styling.By adding the placeholder prop, you provide users with a helpful prompt or instruction about what to enter in the editor, improving the user experience of your application.
  /*const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    // This effect runs after the component has mounted. I add useEffect because this error (Warning: Can't call setState on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the i component.) comes to my console.
    setEditorState(EditorState.createEmpty());
  }, []);*/

  /* const onEditorStateChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
  }, []);

  const MemoizedEditor = React.memo(Editor);

  // Then use MemoizedEditor instead of Editor in your render method
*/



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

              <div style={{ direction: "rtl" }}>
                <DatePicker
                  value={selectedDate}
                  onChange={(date: DateObject | null) => {
                    const newDate = date ? date.toDate() : null;
                    setSelectedDate(newDate);
                    field.onChange(newDate);
                  }}
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
                <MDXEditor
                  //ref={editorRef}
                  markdown={form.watch("content")}//markdown baiad id: content ra bekhanad.
                  plugins={[
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          {" "}
                          <UndoRedo />
                          <BoldItalicUnderlineToggles />
                          <CreateLink /> 
                          <InsertImage/>
                          
                        </>
                      ),// for opening the create link modal I should click the textarea
                    }),
                    linkPlugin(),
                    linkDialogPlugin(), // Add the MDXEditor plugins here
                    imagePlugin()
                  ]}
                  onChange={(value) => form.setValue("content", value)}
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



