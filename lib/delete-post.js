const { exec } = require("child_process");
// import generatePostsCache from "./posts-utils.mjs";

export function deleteLocalFile(data) {
  console.log("data from delete function:", data.frontMatter.path);

  const path = data.frontMatter.path;
  const filePath = `data/posts/${path}`;

  console.log("filePath to delete:", filePath);

  exec(`rm "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    } else {
      console.log("file deleted");
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    // Update the posts cache after file deletion
  });
}










// const fs = require('fs').promises;
// const path = require('path');

// export async function deleteLocalFile(data) {
//   try {
//     console.log("data from delete function:", data.frontMatter.path);

//     const filePath = path.join('data', 'posts', data.frontMatter.path);

//     console.log("filePath to delete:", filePath);

//     await fs.unlink(filePath);
//     console.log("file deleted");
//   } catch (error) {
//     console.error(`File deletion error: ${error.message}`);
//     throw new Error(`File deletion error: ${error.message}`);
//   }
// }








// const { exec } = require("child_process");
// // import generatePostsCache from "./posts-utils.mjs";

// export function deleteLocalFile(data) {
//   console.log("data from delete function:", data.frontMatter.path);

//   const path = data.frontMatter.path;
//   const filePath = `data/posts/${path}`;

//   console.log("filePath to delete:", filePath);

//   exec(`rm "${filePath}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return;
//     } else {
//       console.log("file deleted");
//     }
//     console.log(`stdout: ${stdout}`);
//     console.error(`stderr: ${stderr}`);

//     // Update the posts cache after file deletion
//   });
// }
