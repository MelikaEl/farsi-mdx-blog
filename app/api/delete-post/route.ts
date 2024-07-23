import { deleteLocalFile } from "@/lib/delete-post";

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const data = await req.json();
      await deleteLocalFile(data); // Await the async function
      return new Response(
        JSON.stringify({ message: "Post deleted successfully" }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({ message: "Error in processing your request" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ message: "This endpoint only accepts POST requests" }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  }
}









// import { deleteLocalFile } from "@/lib/delete-post";

// export async function POST(req: Request) {
//   if (req.method === "POST") {
//     try {
//       const data = await req.json();

//       deleteLocalFile(data);
//     } catch (error) {
//       console.error("Error:", error);
//       return new Response(
//         JSON.stringify({
//           message: "Error in processing your request",
//         }),
//         {
//           status: 500,
//           headers: {
//             "content-type": "application/json",
//           },
//         }
//       );
//     }
//   } else {
//     // Handle any non-POST requests
//     return new Response(
//       JSON.stringify({
//         message: "This endpoint only accepts POST requests",
//       }),
//       {
//         headers: {
//           "content-type": "application/json",
//         },
//       }
//     );
//   }
// }
