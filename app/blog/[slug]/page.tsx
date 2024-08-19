import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import Button from "@/components/mdx/button";

// Custom components
import YouTube from "@/components/mdx/youtube";
import Code from "@/components/mdx/code-component/code";
import Quiz from "@/components/mdx/quiz";
import CustomImage from "@/components/mdx/image";

import EditPostButton from "./edit-post-button";
import OpenInVSCode from "./open-in-vs-code-button";

// Examples
import { CustomButton } from "@/components/examples/custom-button";

// Functions
import { getPost } from "@/lib/posts-utils.mjs";
import { isDevMode } from "@/lib/utils";

import type { Metadata, ResolvingMetadata } from "next";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  //decode encode
  //const decodedSlug = decodeURIComponent(params.slug);


  //decode encode
 // const post = await getPost({ slug: decodedSlug });
  const post = await getPost(params);
  const title = post.frontMatter.title;
  const description = post.frontMatter.description;

  const baseURL = "https://mdxblog.io/blog";
    //decode encode
 // const canonicalUrl = `${baseURL}/${encodeURIComponent(params.slug)}`;
 const canonicalUrl = `${baseURL}/${params.slug}`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("data/posts"));
  const params = [];

  for (const filename of files) {
    const fullPath = path.join("data/posts", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontMatter } = matter(fileContents);

    const postDate = new Date(frontMatter.date);
    const currentDate = new Date();
    const isFuture = postDate > currentDate;
//vercel error for creating post
    /*if (filename.endsWith(".mdx")) {
      params.push({ slug: encodeURIComponent(filename.replace(".mdx", "")) });
    }*/
//encode decode 
   /* if (!isFuture) {
      params.push({ slug: encodeURIComponent(filename.replace(".mdx", "")) });
    }
  }*/
    if (!isFuture) {
      params.push({ slug: filename.replace(".mdx", "") });
    }
  }
  return params;
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  //encode decode
 //const decodedSlug = decodeURIComponent(params.slug);
  //encode decode
  //const props = await getPost({ slug: decodedSlug });
  const props = await getPost(params);
  const slug = params.slug;
  const components = {
    pre: Code,
    YouTube,
    CustomImage,
    Quiz,
    CustomButton,
    Button,
  };

  const gregorianDate = new Date(props.frontMatter.date);
  const persianDate = new DateObject({
    date: gregorianDate,
    calendar: persian,
    locale: persian_fa,
  });
  const formattedPersianDate = persianDate.format("DD MMMM YYYY");


  return (
    <div className="flex flex-col gap-3 sm:w-2xl sm:max-w-2xl max-w-sm">
      <div className="mb-2">
        <h1 className="text-5xl font-bold mb-2">{props.frontMatter.title}</h1>
        <div>{formattedPersianDate}</div>
        <div>توسط: {props.frontMatter.author}</div>
      </div>
      {/* {isDevMode() && ( */}
        <div className="flex gap-2 mb-4">
          <EditPostButton
          //encode decode
           // slug={decodedSlug}
            slug={slug}
            author={props.frontMatter.author}
          />
          <OpenInVSCode path={props.frontMatter.path} />
        </div>
       {/* )} */}
      <article className="mdx max-w-sm ">
        <MDXRemote source={props.content} components={components} />
      </article>
    </div>
  );
}








//the working code
// import fs from "fs";
// import path from "path";
// import { MDXRemote } from "next-mdx-remote/rsc";
// import matter from "gray-matter";
// import Button from "@/components/mdx/button";

// // Custom components
// import YouTube from "@/components/mdx/youtube";
// import Code from "@/components/mdx/code-component/code";
// import Quiz from "@/components/mdx/quiz";
// import CustomImage from "@/components/mdx/image";

// import EditPostButton from "./edit-post-button";
// import OpenInVSCode from "./open-in-vs-code-button";

// // Examples
// import { CustomButton } from "@/components/examples/custom-button";

// // Functions
// import { getPost } from "@/lib/posts-utils.mjs";
// import { isDevMode } from "@/lib/utils";

// import type { Metadata, ResolvingMetadata } from "next";

// type Props = {
//   params: { slug: string };
// };

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const decodedSlug = decodeURIComponent(params.slug);
//   const post = await getPost({ slug: decodedSlug });
//   const title = post.frontMatter.title;
//   const description = post.frontMatter.description;

//   const baseURL = "https://mdxblog.io/blog";
//   const canonicalUrl = `${baseURL}/${encodeURIComponent(params.slug)}`;

//   return {
//     title: title,
//     description: description,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//   };
// }

// export async function generateStaticParams() {
//   const files = fs.readdirSync(path.join("data/posts"));
//   const params = [];

//   for (const filename of files) {
//     const fullPath = path.join("data/posts", filename);
//     const fileContents = fs.readFileSync(fullPath, "utf8");
//     const { data: frontMatter } = matter(fileContents);

//     const postDate = new Date(frontMatter.date);
//     const currentDate = new Date();
//     const isFuture = postDate > currentDate;

//     if (!isFuture) {
//       params.push({ slug: encodeURIComponent(filename.replace(".mdx", "")) });
//     }
//   }

//   return params;
// }

// export default async function BlogPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const decodedSlug = decodeURIComponent(params.slug);
//   const props = await getPost({ slug: decodedSlug });
//   const components = {
//     pre: Code,
//     YouTube,
//     CustomImage,
//     Quiz,
//     CustomButton,
//     Button,
//   };

//   return (
//     <div className="flex flex-col gap-3 sm:w-2xl sm:max-w-2xl max-w-sm">
//       <div className="mb-2">
//         <h1 className="text-5xl font-bold mb-2">{props.frontMatter.title}</h1>
//         <div>{props.frontMatter.date}</div>
//         <div>By: {props.frontMatter.author}</div>
//       </div>
//       {isDevMode() && (
//         <div className="flex gap-2 mb-4">
//           <EditPostButton
//             slug={decodedSlug}
//             author={props.frontMatter.author}
//           />
//           <OpenInVSCode path={props.frontMatter.path} />
//         </div>
//       )}
//       <article className="mdx max-w-sm ">
//         <MDXRemote source={props.content} components={components} />
//       </article>
//     </div>
//   );
// }






/*import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import Button from "@/components/mdx/button";

// Custom components
import YouTube from "@/components/mdx/youtube";
import Code from "@/components/mdx/code-component/code";
import Quiz from "@/components/mdx/quiz";
import CustomImage from "@/components/mdx/image";

import EditPostButton from "./edit-post-button";
import OpenInVSCode from "./open-in-vs-code-button";

// Examples
import { CustomButton } from "@/components/examples/custom-button";

// Functions
import { getPost } from "@/lib/posts-utils.mjs";
import { isDevMode } from "@/lib/utils";

import type { Metadata, ResolvingMetadata } from "next";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await getPost({ slug: decodedSlug });
  const title = post.frontMatter.title;
  const description = post.frontMatter.description;

  const baseURL = "https://mdxblog.io/blog";
  const canonicalUrl = `${baseURL}/${encodeURIComponent(params.slug)}`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("data/posts"));
  const params = [];

  for (const filename of files) {
    const fullPath = path.join("data/posts", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontMatter } = matter(fileContents);

    const postDate = new Date(frontMatter.date);
    const currentDate = new Date();
    const isFuture = postDate > currentDate;

    /*const gregorianDate = new Date(frontMatter.date);
    const currentDate = new Date();
    const persianDate = new DateObject({
      date: gregorianDate,
      calendar: persian,
      locale: persian_fa,
    });
    const formattedDate = `${persianDate.format("DD MMMM YYYY")}`;//YYYY-MM-DD
    const isFuture =  formattedDate > currentDate;*/



    /*if (!isFuture) {
      params.push({ slug: encodeURIComponent(filename.replace(".mdx", "")) });
    }
  }

  return params;
/*}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  const props = await getPost({ slug: decodedSlug });
  const components = {
    pre: Code,
    YouTube,
    CustomImage,
    Quiz,
    CustomButton,
    Button,
  };

  return (
    <div className="flex flex-col gap-3 sm:w-2xl sm:max-w-2xl max-w-sm">
      <div className="mb-2">
        <h1 className="text-5xl font-bold mb-2">{props.frontMatter.title}</h1>
        <div>{props.frontMatter.date}</div>
        <div>By: {props.frontMatter.author}</div>
      </div>
      {isDevMode() && (
        <div className="flex gap-2 mb-4">
          <EditPostButton
            slug={decodedSlug}
            author={props.frontMatter.author}
          />
          <OpenInVSCode path={props.frontMatter.path} />
        </div>
      )}
      <article className="mdx max-w-sm ">
        <MDXRemote source={props.content} components={components} />
      </article>
    </div>
  );
}*/








// import fs from "fs";
// import path from "path";
// import { MDXRemote } from "next-mdx-remote/rsc";
// import matter from "gray-matter";
// import Button from "@/components/mdx/button";

// //custom components
// import YouTube from "@/components/mdx/youtube";
// import Code from "@/components/mdx/code-component/code";
// import Quiz from "@/components/mdx/quiz";
// import CustomImage from "@/components/mdx/image";

// import EditPostButton from "./edit-post-button";
// import OpenInVSCode from "./open-in-vs-code-button";

// //examples
// import { CustomButton } from "@/components/examples/custom-button";

// //functions
// import { getPost } from "@/lib/posts-utils.mjs";
// import { isDevMode } from "@/lib/utils";

// import type { Metadata, ResolvingMetadata } from "next";

// type Props = {
//   params: { slug: string };
// };

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const post = await getPost(params);
//   // console.log("post:", post);
//   const title = post.frontMatter.title;
//   const description = post.frontMatter.description;

//   // Define your base URL (or use an environment variable)
//   const baseURL = "https://mdxblog.io/blog"; // Replace with your actual domain

//   // Construct the full canonical URL
//   const canonicalUrl = `${baseURL}/${params.slug}`;

//   return {
//     title: title,
//     description: description,
//     // Add the canonical URL to the metadata
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     // add other metadata fields as needed
//   };
// }

// export async function generateStaticParams() {
//   const files = fs.readdirSync(path.join("data/posts"));
//   const params = [];

//   for (const filename of files) {
//     // Read the content of the file
//     const fullPath = path.join("data/posts", filename);
//     const fileContents = fs.readFileSync(fullPath, "utf8");

//     // Extract the front matter to get the date
//     // Assuming you use gray-matter or a similar library to parse front matter
//     const { data: frontMatter } = matter(fileContents);

//     // Parse the date and compare with the current date
//     const postDate = new Date(frontMatter.date);
//     const currentDate = new Date();
//     const isFuture = postDate > currentDate;

//     if (!isFuture) {
//       params.push({ slug: filename.replace(".mdx", "") });
//     }

//     //
//   }

//   // console.log("params!!!:", params);

//   return params;
// }

// export default async function BlogPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   //
//   const props = await getPost(params);

//   const slug = params.slug;

//   const components = {
//     pre: Code,
//     YouTube,
//     CustomImage,
//     Quiz,
//     CustomButton,
//     Button,
//   };

//   return (
//     <div className="flex flex-col gap-3 sm:w-2xl sm:max-w-2xl max-w-xs">
//       <div className="mb-2">
//         <h1 className="text-5xl font-bold mb-2">{props.frontMatter.title}</h1>
//         <div>{props.frontMatter.date}</div>
//         <div>By: {props.frontMatter.author}</div>
//       </div>
//       {isDevMode() && (
//         <div className="flex gap-2 mb-4">
//           <EditPostButton slug={slug} author={props.frontMatter.author} />
//           <OpenInVSCode path={props.frontMatter.path} />
//         </div>
//       )}
//       <div className="flex gap-4"></div>
//       <article className="mdx">
//         <MDXRemote source={props.content} components={components} />
//       </article>
//     </div>
//   );
// }
