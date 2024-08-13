//tiptap editor with tiptap toolbar that has error
import React, { useEffect, useRef, useState } from "react";
import { Editor as TiptapEditor, EditorContent, useEditor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce } from "lodash"; // for debouncing the content update
import { useTheme } from "next-themes";
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';

import dynamic from "next/dynamic"; // for SSR rendering in Editor component

/*const EditorProviderComponent = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorProvider),
  { ssr: false }
);*/

interface EditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
          Strike
        </button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
          Paragraph
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
          Bullet list
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
          Redo
        </button>
        <button onClick={() => editor.chain().focus().setColor('#958DF1').run()} className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}>
          Purple
        </button>
      </div>
    </div>
  );
};

const Editor: React.FC<EditorProps> = ({ initialContent, onContentChange }) => {

  const editorRef = useRef<TiptapEditor | null>(null);
  const [editorContent, setEditorContent] = useState(initialContent);
  const { theme } = useTheme();

  // Initialize the tiptap editor
  const editor = useEditor({
    //immediatelyRender: false,
    extensions: [
      StarterKit,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
    ],
    content: initialContent ,
  
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // Update content on change
      onContentChange(html);
    },
  });
  

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(initialContent); // Set initial content
    }
  }, [initialContent, editor]);

  const debouncedContentUpdate = debounce((value: string) => {
    setEditorContent(value);
    onContentChange(value);
  }, 500); // Debounce delay in milliseconds

 // Ensure the editor is set up before rendering the provider
 if (!editor) {
  return null; // Prevent rendering until the editor is initialized
}


  return (
    <EditorProvider  slotBefore={<MenuBar />} content={editor.getHTML()} >
      <div >
        <EditorContent editor={editor} />
      </div>
    </EditorProvider>
  );
};

//export { Editor };
export default Editor;


/*
//it works withour error
return (
   
  <div >
    <EditorContent editor={editor} />
  </div>

);*/




/*
return (
    <EditorProvider slotBefore={<MenuBar />}>
      <div className={theme === "dark" ? "dark-theme dark-editor" : ""}>
        
        <EditorContent editor={editor} />
      </div>
    </EditorProvider>
  );
*/ 








/*import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

import  { useEffect, useState, useRef } from "react";
import { Editor as TiptapEditor, EditorContent, useEditor } from "@tiptap/react";
import { debounce } from "lodash"; // for debouncing the content update

interface EditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const MenuBar: React.FC<EditorProps> = ({ initialContent, onContentChange }) => {

  const editorRef = useRef<TiptapEditor | null>(null);
  const [editorContent, setEditorContent] = useState(initialContent);
//const MenuBar = () => {
  //const { editor } = useCurrentEditor()

  const editor = useEditor({
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // Update content on change
      onContentChange(html); 
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(initialContent); // Set initial content
    }
  }, [initialContent, editor]);

  const debouncedContentUpdate = debounce((value: string) => {
    setEditorContent(value);
    onContentChange(value);
  }, 500); // Debounce delay in milliseconds



  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          Purple
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

// const content = `
// <h2>
//   Hi there,
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That’s a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>
// <p>
//   I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
// </p>
// <blockquote>
//   Wow, that’s amazing. Good work, boy! 👏
//   <br />
//   — Mom
// </blockquote>
// `
const  Toolbar  = () => {

  return (
    <EditorProvider slotBefore={<MenuBar />} extensions={extensions}   ></EditorProvider>
  )
}
  export default Toolbar;*/












// import { Color } from '@tiptap/extension-color'
// import ListItem from '@tiptap/extension-list-item'
// import TextStyle from '@tiptap/extension-text-style'
// import { EditorProvider, useCurrentEditor } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import React from 'react'

// const MenuBar = () => {
//   const { editor } = useCurrentEditor()

//   if (!editor) {
//     return null
//   }

//   return (
//     <div className="control-group">
//       <div className="button-group">
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleBold()
//               .run()
//           }
//           className={editor.isActive('bold') ? 'is-active' : ''}
//         >
//           Bold
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleItalic()
//               .run()
//           }
//           className={editor.isActive('italic') ? 'is-active' : ''}
//         >
//           Italic
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleStrike()
//               .run()
//           }
//           className={editor.isActive('strike') ? 'is-active' : ''}
//         >
//           Strike
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCode().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleCode()
//               .run()
//           }
//           className={editor.isActive('code') ? 'is-active' : ''}
//         >
//           Code
//         </button>
//         <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
//           Clear marks
//         </button>
//         <button onClick={() => editor.chain().focus().clearNodes().run()}>
//           Clear nodes
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setParagraph().run()}
//           className={editor.isActive('paragraph') ? 'is-active' : ''}
//         >
//           Paragraph
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
//         >
//           H1
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
//         >
//           H2
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
//         >
//           H3
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
//           className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
//         >
//           H4
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
//           className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
//         >
//           H5
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
//           className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
//         >
//           H6
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editor.isActive('bulletList') ? 'is-active' : ''}
//         >
//           Bullet list
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={editor.isActive('orderedList') ? 'is-active' : ''}
//         >
//           Ordered list
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className={editor.isActive('codeBlock') ? 'is-active' : ''}
//         >
//           Code block
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={editor.isActive('blockquote') ? 'is-active' : ''}
//         >
//           Blockquote
//         </button>
//         <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
//           Horizontal rule
//         </button>
//         <button onClick={() => editor.chain().focus().setHardBreak().run()}>
//           Hard break
//         </button>
//         <button
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .undo()
//               .run()
//           }
//         >
//           Undo
//         </button>
//         <button
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .redo()
//               .run()
//           }
//         >
//           Redo
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setColor('#958DF1').run()}
//           className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
//         >
//           Purple
//         </button>
//       </div>
//     </div>
//   )
// }

// const extensions = [
//   Color.configure({ types: [TextStyle.name, ListItem.name] }),
//   TextStyle.configure({ types: [ListItem.name] }),
//   StarterKit.configure({
//     bulletList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//     orderedList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//   }),
// ]


// export default () => {
//     return (
//       <EditorProvider slotBefore={<MenuBar />} extensions={extensions} ></EditorProvider>
//     )
//   }










// import React from 'react';
// import { useEditor } from '@tiptap/react';

// const Toolbar: React.FC = () => {
//   const editor = useEditor();

//   const toggleBold = () => {
//     editor?.chain().focus().toggleBold().run();
//   };

//   const toggleItalic = () => {
//     editor?.chain().focus().toggleItalic().run();
//   };

//   return (
//     <div className="toolbar">
//       <button onClick={toggleBold}>Bold</button>
//       <button onClick={toggleItalic}>Italic</button>
//     </div>
//   );
// };

// export default Toolbar;