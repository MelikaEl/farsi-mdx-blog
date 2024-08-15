
"use client";

import React, { useState} from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "@/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import { Editor } from "react-draft-wysiwyg";
import dynamic from "next/dynamic"; //for SSR renndering in Editor component

import Editor from "@/components/mdx-editor";

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


function Test() {
  return (
    <>
    <MDXEditor
     // ref={editorRef}
      markdown="hello"
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
               {' '}
              <ListsToggle />
              
            </>
          )
        }),
        listsPlugin(),
        
      ]}
    />
    </>
  )
}

export default Test