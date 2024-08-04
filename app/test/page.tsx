
"use client";

import React, { useState} from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import { Editor } from "react-draft-wysiwyg";
import dynamic from "next/dynamic"; //for SSR renndering in Editor component

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
  );


function Test() {
  return (
    <>
    <Editor/>
    </>
  )
}

export default Test