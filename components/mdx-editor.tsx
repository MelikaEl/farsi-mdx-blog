import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic"; // for SSR rendering in Editor component
import { debounce } from "lodash"; // we use debounce from lodash because ofr the closing and reopening of the editor while typing
import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  BlockTypeSelect,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  ListsToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { useTheme } from "next-themes";

const MDXEditorComponent = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  { ssr: false }
);

interface EditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onContentChange }) => {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [editorContent, setEditorContent] = useState(initialContent);

  useEffect(() => {
    setEditorContent(initialContent);
  }, [initialContent]);

  const debouncedContentUpdate = debounce((value: string) => {
    setEditorContent(value);
    onContentChange(value);
  }, 500); // Debounce delay in milliseconds

  const { theme } = useTheme();

  return (
    <MDXEditorComponent
      className={theme === "dark" ? "dark-theme dark-editor" : ""} // based on the docs of the MDXEditor (theming part) we use className="dark-theme dark-editor". drak defined in the tailwindcss
     // ref={editorRef}
      markdown={editorContent}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
               {' '}
              <ListsToggle />
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
              <BlockTypeSelect />
            </>
          )
        }),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        headingsPlugin(), //to have h1.....h6 in the items of (select block type) item in the toolbar, we should use headingsPlugin beside BlockTypeSelect component
        quotePlugin(), //to have Quote in the items of (select block type) item in the toolbar, we should use quotePlugin beside BlockTypeSelect component
      ]}
      onChange={debouncedContentUpdate} // this is necessary for the submition of the data in the MDXEditor component after we submit the form
    />
  );
};

export default Editor;

// import React, { useRef, useEffect, useState } from "react";
// import dynamic from "next/dynamic"; //for SSR renndering in Editor component
// import { debounce } from "lodash";
// import {
//   MDXEditor,
//   MDXEditorMethods,
//   toolbarPlugin,
//   linkPlugin,
//   linkDialogPlugin,
//   imagePlugin,
//   listsPlugin,
//   UndoRedo,
//   BoldItalicUnderlineToggles,
//   CreateLink,
//   InsertImage,
//   ListsToggle,
// } from "@mdxeditor/editor";
// import "@mdxeditor/editor/style.css";

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// const MDXEditorComponent = dynamic(
//   () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
//   { ssr: false }
// );

// function Editor () {
//   const editorRef = useRef<MDXEditorMethods | null>(null);
//   //const [editorContent, setEditorContent] = useState(initialContent);

//   const formSchema = z.object({
//     date: z.date(), // Make dob optional
//     type: z.string().optional(),
//     title: z.string().min(3, {
//       message: "عنوان باید حداقل 2 کاراکتر باشد.",
//     }),
//     author: z.string().min(3, {
//       message: "نویسنده باید حداقل 3 کاراکتر داشته باشد.",
//     }),
//     description: z.string().min(15, {
//       message: "توضیحات باید حداقل 15 کاراکتر باشد.",
//     }),
//     content: z.string().min(2, {
//       message: "محتوا باید حداقل 2 کاراکتر باشد.",
//     }),
//     categories: z.array(z.string()).nonempty(),
//     tags: z.string().optional(),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       date: new Date(),
//       type: "blog",
//       title: "",
//       author: "",
//       description: "",
//       content: "",
//       categories: ["توسعه وب"],
//       tags: "",
//     },
//   });

//   const [editorContent, setEditorContent] = useState("");

//   return (
//     <FormField
//       control={form.control}
//       name="content"
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>محتوا</FormLabel>
//           <FormControl>
//             <MDXEditorComponent
//               ref={editorRef}
//               markdown={form.watch("content")}
//               plugins={[
//                 toolbarPlugin({
//                   toolbarContents: () => (
//                     <>
//                       <UndoRedo />
//                       <BoldItalicUnderlineToggles />
//                       <CreateLink />
//                       <InsertImage />
//                       <ListsToggle />
//                     </>
//                   ),
//                 }),
//                 linkPlugin(),
//                 linkDialogPlugin(),
//                 imagePlugin(),
//                 listsPlugin(),
//               ]}
//               onChange={(value) => form.setValue("content", value)}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export default Editor;

// import React from "react";
// import dynamic from "next/dynamic"; //for SSR renndering in Editor component
// import { debounce } from "lodash";

// import {
//   MDXEditor,
//   MDXEditorMethods,
//   UndoRedo,
//   BoldItalicUnderlineToggles,
//   CreateLink,
//   toolbarPlugin,
//   linkPlugin,
//   linkDialogPlugin,
//   InsertImage,
//   imagePlugin,
// } from "@mdxeditor/editor";

// import "@mdxeditor/editor/style.css";

// function Editor() {
//   interface EditorProps {
//     markdown: string;
//     editorRef?: React.MutableRefObject<MDXEditorMethods | null>; //This line defines a prop called editorRef with a specific TypeScript type. Let's examine each part:editorRef?:The ? after editorRef indicates that this prop is optional. It means that when using the component, you don't have to provide this prop if you don't need it.React.MutableRefObject:This is a type provided by React for mutable refs.Mutable refs are used to hold a mutable value that persists for the full lifetime of the component.<MDXEditorMethods | null>:This is a generic type parameter for MutableRefObject.It specifies that the ref can hold either an object of type MDXEditorMethods or null.The | symbol represents a union type, meaning it can be one type or the other.MDXEditorMethods:This is likely an interface or type defined by the MDXEditor library. It probably contains methods that can be called on the editor instance, such as focusing the editor, getting or setting content, etc.
//   }

//   const MDXEditor = dynamic(
//     () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
//     { ssr: false }
//   );

//   const debouncedContentUpdate = debounce((value: string) => {
//     setEditorContent(value);
//     onContentChange(value);
//   }, 500); // Debounce delay in milliseconds

//   return (
//     <MDXEditor
//       //ref={editorRef}
//       markdown={form.watch("content")} //MDXEditor should reads id: content. It reads our contents that I write in textarea of MDXEditor.
//       plugins={[
//         toolbarPlugin({
//           toolbarContents: () => (
//             <>
//               {" "}
//               <UndoRedo />
//               <BoldItalicUnderlineToggles />
//               <CreateLink />
//               <InsertImage />
//             </>
//           ), // for opening the create link modal I should click the textarea
//         }),
//         linkPlugin(),
//         linkDialogPlugin(), // Add the MDXEditor plugins here
//         imagePlugin(),
//       ]}
//       onChange={(value) => debouncedContentUpdate(value)} //It is essential for submitting our contents in the MDXEditor.
//     />
//   );
// }

// export default Editor;
