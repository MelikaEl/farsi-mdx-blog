Here’s a suggested description of your changes for the README.md file on GitHub:
Changes Made
This project has been enhanced with several significant updates to improve functionality, usability, and accessibility. Below are the key modifications:
MDXEditor Integration:
Replaced the textarea component from Shadcn with MDXEditor, which offers advanced features such as:
Undo and redo functionality
Text formatting options (bold, italic, underline)
Ability to insert video links and image links
Thematic breaks
Block types with 8 options including:
Paragraph
Quote
Headings (1 to 6)
Language Translation:
Translated the entire MDX blog content from English to Persian, making it accessible to a wider audience.
Styling Updates:
Changed the website's font for improved readability.
Updated the theme color from yellow to green for a fresh visual appeal.
Bug Fixes:
Resolved an issue with the delete post button in the edit post section, ensuring it functions correctly and deletes posts as intended.
Content Updates:
Modified the content of the About and Privacy pages to reflect the new changes and provide relevant information.
Deployment:
Successfully deployed the updated blog on Vercel for live access.
RTL Support:
Enhanced the blog project to support the creation and management of blog posts in non-English languages, specifically Persian, and ensured compatibility with right-to-left (RTL) text direction.
These changes collectively enhance the user experience and broaden the blog's accessibility to Persian-speaking users.












[**MDX Blog** (mdxblog.io)](https://mdxblog.io) is a platform built with the latest web technologies, offering a unique blogging experience. MDX Blog is a simple template for creating blogs using MDX (Markdown + JSX) and Next.js 14. Unlike traditional blogging solutions that rely on a database to store content, content management in MDXBlog is handled by easily editable Markdown (mdx) files in a folder on your local machine! It's a good solution for those who appreciate the ease of Markdown and the power of React components.

Our project is fully accessible on **[GitHub](https://github.com/owolfdev/mdx-blog-basic)**.

**Installation:**

- Clone the [**repo**](https://github.com/owolfdev/mdx-blog-basic)
- Run `npm install`
- Run `npm run dev`
- Open `http://localhost:3000` in your browser
- Create a remote repo on GitHub
- Push your local repo to GitHub
- Deploy on Vercel

**Create a post:**

- Use the '+' icon in the nav bar, in development mode only, to create a new post - or simply create a new MDX file in the `data/posts` directory, manually.
- Edit posts in the browser or manually using VS Code (recommended), or any other text editor.

**Key Features of MDX Blog:**

- **Next.js 14 & App Router**: Utilizing the cutting-edge features of Next.js 14, MDX Blog offers a seamless and efficient user experience, underpinned by the powerful app router for smooth navigation.
- [**Deployed on Vercel**](https://vercel.com): Experience the reliability and speed of Vercel, ensuring that our static blog site is always available and performs exceptionally.
- **SEO Optimized**: With automatic sitemap generation at build time through 'next sitemap', our platform is finely tuned for search engine optimization, enhancing the visibility and reach of your content.
- **Dynamic Publishing**: Our platform smartly handles future-dated posts, ensuring they are published only on or after their set date, thanks to a meticulous filtering system.
- **Development Mode Features**: In development mode, users can swiftly create new posts using the '+' icon, streamlining the content creation process.
- **Flexible Content Editing**: Edit your MDX (Markdown + JSX) posts with ease, either directly in the browser or using VS Code, providing a flexible and user-friendly environment for content creators.

**Custom MDX Components:**

- `<YouTube />`: Seamlessly embed YouTube videos within your content.
- `<Image />`: Integrate images elegantly, enhancing the visual appeal of your posts.
- `code`: Include and showcase code snippets with clarity and style.

### Dynamic Page Rendering

Our dynamic page rendering system is the backbone of MDX Blog, carefully extracting and presenting content. It leverages the next-mdx-remote/rsc for rendering MDX content, along with custom components like YouTube, Image, and Code, bringing a rich and interactive blogging experience.

**Development Insights:**

- Utilizing gray-matter for front matter parsing, we extract crucial metadata for SEO and rendering purposes.
- Only relevant posts are displayed, based on their publication date.
- In development mode, additional tools like EditPostButton and OpenInVSCode are available, enhancing the ease of content management and editing.

**MDX Blog** represents a blend of technological innovation and user-centric design, providing a platform that's not only a pleasure to use but also powerful in its capabilities. Whether you're a developer, a content creator, or someone passionate about blogging, MDX Blog offers you the tools to share your stories and ideas with the world effortlessly.
