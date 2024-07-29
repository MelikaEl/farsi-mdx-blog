"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { FilterFn, Row } from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export type Post = {
  id: string;
  type: string;
  title: string;
  date: string;
  slug: string;
  author: string;
  description: string;
  tags: string[];
};

export const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mr-5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاریخ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gregorianDate = new Date(row.getValue("date")); //new Date(post.date) acts as a crucial intermediary step, converting potentially varied date string formats from your MDX files into a standardized JavaScript Date object. This standardization is essential for the accurate and consistent conversion to the Persian calendar system in the subsequent steps of your code.
      const persianDate = new DateObject({
        date: gregorianDate,
        calendar: persian,
        locale: persian_fa,
      });

      const formattedDate = `${persianDate.format("DD MMMM YYYY")}`; //YYYY-MM-DD
      return <div>{formattedDate}</div>;

      // // Parse the date from the row
      // const date = new Date(row.getValue("date"));

      // // Format the date as 'DD.MM.YY'
      // const formattedDate = date.toLocaleDateString("en-GB", {
      //   day: "2-digit",
      //   month: "2-digit",
      //   year: "2-digit",
      // });

      // return <div>{formattedDate}</div>;
    },
  },

  {
    accessorKey: "type", // Access the 'type' attribute of your data
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          نوع
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.getValue("type")}</span>, // Access and display the 'type' value from each row
  },

  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عنوان
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {" "}
        <Link href={`/blog/${row.original.slug}`}>
          <TooltipProvider>
            <Tooltip>
              {/* <TooltipTrigger>{row.getValue("title")}</TooltipTrigger> */}
              <TooltipTrigger>
                <div className="text-left">{row.getValue("title")}</div>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm px-4 py-2">
                {row.original.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          وضعیت
        </Button>
      );
    },
    cell: ({ row }) => {
      // Get the current date
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time part for comparison

      // Parse the date from the row
      const postDate = new Date(row.getValue("date"));

      // Determine the status based on the date
      const status = postDate <= currentDate ? "منتشر شده" : "منتشر نشده";

      return <div className="capitalize">{status}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original;

      const direction = "rtl";

      return (
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post.id)}
            >
              کپی شناسه پست
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/blog/edit/${post.slug}`}>ویرایش</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable() {
  const [data, setData] = React.useState<Post[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/get-posts");
        if (response.ok) {
          let posts = await response.json();

          // Sort the posts by date in descending order
          posts.sort((a: any, b: any) => {
            // Convert dates to timestamps for comparison
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Descending order
          });

          setData(posts); // Set the sorted posts into the state
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  const globalFilterFn: FilterFn<Post> = (row, columnIds, filterValue) => {
    const lowercasedFilter = filterValue?.toLowerCase() || "";

    console.log("row!!:", row);

    // Return true if the row should be included in the filter
    return (
      row.original.title.toLowerCase().includes(lowercasedFilter) ||
      row.original.description.toLowerCase().includes(lowercasedFilter) ||
      row.original.type.toLowerCase().includes(lowercasedFilter) ||
      (row.original.tags &&
        row.original.tags.some((tag) =>
          tag.toLowerCase().includes(lowercasedFilter)
        ))
    );
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [{ id: "date", desc: true }], // Default sorting by 'date' in descending order
      pagination: {
        pageSize: 15, // Existing pagination state
      },
    },
  });

  const direction = "rtl";
  // Define a type for the column IDs
  type ColumnId = "date" | "type" | "title" | "status";

  // Mapping of English column IDs to Persian names
  const columnNameMapping: Record<ColumnId, string> = {
    date: "تاریخ",
    type: "نوع",
    title: "عنوان",
    status: "وضعیت",
  };

  // Type guard to check if a value is a key of ColumnId
  const isColumnId = (value: string): value is ColumnId => {
    return Object.keys(columnNameMapping).includes(value.toLowerCase());
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 " style={{ gap: "16px" }}>
        <Input
          placeholder="جستجوی پست ها..."
          // Use a global filter value from the table state
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => {
            // Update the global filter value
            table.setGlobalFilter(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              ستون ها <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnKey = column.id.toLowerCase();
                const persianName = isColumnId(columnKey)
                  ? columnNameMapping[columnKey as ColumnId]
                  : column.id;
                return (
                  <DropdownMenuCheckboxItem
                    dir={direction}
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {persianName}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  هیچ نتیجه ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} از{" "}
          {table.getFilteredRowModel().rows.length} ردیف(ها) انتخاب شده است.
        </div>
        {/*<div className="space-x-2">*/}
        <div style={{ display: "flex", gap: "16px" }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            قبلی
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            بعدی
          </Button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import * as React from "react";
// import {
//   CaretSortIcon,
//   ChevronDownIcon,
//   DotsHorizontalIcon,
// } from "@radix-ui/react-icons";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// import { FilterFn, Row } from "@tanstack/react-table";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import Link from "next/link";

// export type Post = {
//   id: string;
//   type: string;
//   title: string;
//   date: string;
//   slug: string;
//   author: string;
//   description: string;
//   tags: string[];
// };

// export const columns: ColumnDef<Post>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },

//   {
//     accessorKey: "date",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Date
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       // Parse the date from the row
//       const date = new Date(row.getValue("date"));

//       // Format the date as 'DD.MM.YY'
//       const formattedDate = date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "2-digit",
//       });

//       return <div>{formattedDate}</div>;
//     },
//   },

//   {
//     accessorKey: "type", // Access the 'type' attribute of your data
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Type
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => <span>{row.getValue("type")}</span>, // Access and display the 'type' value from each row
//   },

//   {
//     accessorKey: "title",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Title
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div>
//         {" "}
//         <Link href={`/blog/${row.original.slug}`}>
//           <TooltipProvider>
//             <Tooltip>
//               {/* <TooltipTrigger>{row.getValue("title")}</TooltipTrigger> */}
//               <TooltipTrigger>
//                 <div className="text-left">{row.getValue("title")}</div>
//               </TooltipTrigger>
//               <TooltipContent className="max-w-sm px-4 py-2">
//                 {row.original.description}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </Link>
//       </div>
//     ),
//   },

//   {
//     accessorKey: "status",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Status
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       // Get the current date
//       const currentDate = new Date();
//       currentDate.setHours(0, 0, 0, 0); // Reset time part for comparison

//       // Parse the date from the row
//       const postDate = new Date(row.getValue("date"));

//       // Determine the status based on the date
//       const status = postDate <= currentDate ? "published" : "unpublished";

//       return <div className="capitalize">{status}</div>;
//     },
//   },

//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const post = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(post.id)}
//             >
//               Copy post ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href={`/blog/edit/${post.slug}`}>Edit</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export function DataTable() {
//   const [data, setData] = React.useState<Post[]>([]);
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   React.useEffect(() => {
//     async function fetchPosts() {
//       try {
//         const response = await fetch("/api/get-posts");
//         if (response.ok) {
//           let posts = await response.json();

//           // Sort the posts by date in descending order
//           posts.sort((a: any, b: any) => {
//             // Convert dates to timestamps for comparison
//             const dateA = new Date(a.date).getTime();
//             const dateB = new Date(b.date).getTime();
//             return dateB - dateA; // Descending order
//           });

//           setData(posts); // Set the sorted posts into the state
//         } else {
//           console.error("Failed to fetch posts");
//         }
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     }

//     fetchPosts();
//   }, []);

//   const globalFilterFn: FilterFn<Post> = (row, columnIds, filterValue) => {
//     const lowercasedFilter = filterValue?.toLowerCase() || "";

//     console.log("row!!:", row);

//     // Return true if the row should be included in the filter
//     return (
//       row.original.title.toLowerCase().includes(lowercasedFilter) ||
//       row.original.description.toLowerCase().includes(lowercasedFilter) ||
//       row.original.type.toLowerCase().includes(lowercasedFilter) ||
//       (row.original.tags &&
//         row.original.tags.some((tag) =>
//           tag.toLowerCase().includes(lowercasedFilter)
//         ))
//     );
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     globalFilterFn: globalFilterFn,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     initialState: {
//       sorting: [{ id: "date", desc: true }], // Default sorting by 'date' in descending order
//       pagination: {
//         pageSize: 15, // Existing pagination state
//       },
//     },
//   });

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Search posts..."
//           // Use a global filter value from the table state
//           value={table.getState().globalFilter ?? ""}
//           onChange={(event) => {
//             // Update the global filter value
//             table.setGlobalFilter(event.target.value);
//           }}
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import * as React from "react";
// import {
//   CaretSortIcon,
//   ChevronDownIcon,
//   DotsHorizontalIcon,
// } from "@radix-ui/react-icons";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// import { FilterFn, Row } from "@tanstack/react-table";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import Link from "next/link";

// export type Post = {
//   id: string;
//   type: string;
//   title: string;
//   date: string;
//   slug: string;
//   author: string;
//   description: string;
//   tags: string[];
// };

// export const columns: ColumnDef<Post>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },

//   {
//     accessorKey: "تاریخ",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           تاریخ
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       // Parse the date from the row
//       const date = new Date(row.getValue("date"));

//       // Format the date as 'DD.MM.YY'
//       const formattedDate = date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "2-digit",
//       });

//       return <div>{formattedDate}</div>;
//     },
//   },

//   {
//     accessorKey: "نوع", // Access the 'type' attribute of your data
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           نوع
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => <span>{row.getValue("type")}</span>, // Access and display the 'type' value from each row
//   },

//   {
//     accessorKey: "عنوان",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           عنوان
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => (
//       <div>
//         {" "}
//         <Link href={`/blog/${row.original.slug}`}>
//           <TooltipProvider>
//             <Tooltip>
//               {/* <TooltipTrigger>{row.getValue("title")}</TooltipTrigger> */}
//               <TooltipTrigger>
//                 <div className="text-left">{row.getValue("title")}</div>
//               </TooltipTrigger>
//               <TooltipContent className="max-w-sm px-4 py-2">
//                 {row.original.description}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </Link>
//       </div>
//     ),
//   },

//   {
//     accessorKey: "وضعیت",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           وضعیت
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       // Get the current date
//       const currentDate = new Date();
//       currentDate.setHours(0, 0, 0, 0); // Reset time part for comparison

//       // Parse the date from the row
//       const postDate = new Date(row.getValue("date"));

//       // Determine the status based on the date
//       const status = postDate <= currentDate ? "منتشر شده" : "منتشر نشده";

//       return <div className="capitalize">{status}</div>;
//     },
//   },

//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const post = row.original;

//       const direction = "rtl" ;

//       return (
//         <DropdownMenu dir={direction}>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>اقدامات</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(post.id)}
//             >
//               کپی شناسه پست
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href={`/blog/edit/${post.slug}`}>ویرایش</Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export function DataTable() {
//   const [data, setData] = React.useState<Post[]>([]);
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   React.useEffect(() => {
//     async function fetchPosts() {
//       try {
//         const response = await fetch("/api/get-posts");
//         if (response.ok) {
//           let posts = await response.json();

//           // Sort the posts by date in descending order
//           posts.sort((a: any, b: any) => {
//             // Convert dates to timestamps for comparison
//             const dateA = new Date(a.date).getTime();
//             const dateB = new Date(b.date).getTime();
//             return dateB - dateA; // Descending order
//           });

//           setData(posts); // Set the sorted posts into the state
//         } else {
//           console.error("Failed to fetch posts");
//         }
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     }

//     fetchPosts();
//   }, []);

//   const globalFilterFn: FilterFn<Post> = (row, columnIds, filterValue) => {
//     const lowercasedFilter = filterValue?.toLowerCase() || "";

//     console.log("row!!:", row);

//     // Return true if the row should be included in the filter
//     return (
//       row.original.title.toLowerCase().includes(lowercasedFilter) ||
//       row.original.description.toLowerCase().includes(lowercasedFilter) ||
//       row.original.type.toLowerCase().includes(lowercasedFilter) ||
//       (row.original.tags &&
//         row.original.tags.some((tag) =>
//           tag.toLowerCase().includes(lowercasedFilter)
//         ))
//     );
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     globalFilterFn: globalFilterFn,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//     initialState: {
//       sorting: [{ id: "date", desc: true }], // Default sorting by 'date' in descending order
//       pagination: {
//         pageSize: 15, // Existing pagination state
//       },
//     },
//   });

//   const direction = "rtl" ;

//   return (
//     <div className="w-full">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="جستجوی پست ها..."
//           // Use a global filter value from the table state
//           value={table.getState().globalFilter ?? ""}
//           onChange={(event) => {
//             // Update the global filter value
//             table.setGlobalFilter(event.target.value);
//           }}
//           className="max-w-sm"
//         />
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="ml-auto">
//               ستون ها <ChevronDownIcon className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => {
//                 return (
//                   <DropdownMenuCheckboxItem
//                   dir={direction}
//                     key={column.id}
//                     className="capitalize"
//                     checked={column.getIsVisible()}
//                     onCheckedChange={(value) =>
//                       column.toggleVisibility(!!value)
//                     }
//                   >
//                     {column.id}
//                   </DropdownMenuCheckboxItem>
//                 );
//               })}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   هیچ نتیجه ای یافت نشد.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} از{" "}
//           {table.getFilteredRowModel().rows.length} ردیف(ها) انتخاب شده است.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             قبلی
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             بعدی
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
