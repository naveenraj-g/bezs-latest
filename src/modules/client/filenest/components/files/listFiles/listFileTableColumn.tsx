import { ColumnDef } from "@tanstack/react-table";
import { Download, Edit, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { TanstackTableColumnSorting } from "@/modules/shared/components/table/tanstack-table-column-sorting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { bytesToSize, formatSmartDate } from "@/modules/shared/helper";
import { TGetUserFilesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/filenest";

export const listFileTableColumn = (): ColumnDef<
  TGetUserFilesControllerOutput[number]
>[] => [
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="File Name"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorKey: "fileName",
    cell({ row }) {
      const fileName = row.original.fileName;
      return (
        <p className="truncate max-w-[250px] xl:max-w-[450px]" title={fileName}>
          {fileName}
        </p>
      );
    },
  },
  //   {
  //     header: ({ column }) => {
  //       const isSorted = column.getIsSorted();

  //       return (
  //         <TanstackTableColumnSorting
  //           label="Name"
  //           column={column}
  //           isSorted={isSorted}
  //         />
  //       );
  //     },
  //     id: "appData",
  //     accessorKey: "appData",
  //     cell({ row }) {
  //       const appData = appDatas?.find(
  //         (appData) => appData.id === row.original.appId
  //       );
  //       return <span className="truncate">{appData?.name}</span>;
  //     },
  //   },
  {
    header: "File Size",
    accessorKey: "fileSize",
    cell({ row }) {
      const size = row.original.fileSize;
      return bytesToSize(size);
    },
  },
  {
    header: "File Type",
    accessorKey: "fileType",
  },
  {
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <TanstackTableColumnSorting
          label="File category"
          column={column}
          isSorted={isSorted}
        />
      );
    },
    accessorFn: (row) => row.fileEntity.label,
    id: "fileEntityLabel",
    cell: ({ getValue }) => {
      return <span>{getValue<string>()}</span>;
    },
    filterFn: "equals",
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      const formattedDate = formatSmartDate(updatedAt);
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "ACTIONS",
    id: "actions",
    cell: ({ row }) => {
      const appSettingData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ size: "icon", variant: "ghost" }),
              "rounded-full"
            )}
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="left">
            <DropdownMenuItem
              className="cursor-pointer space-x-2"
              //   onClick={() =>
              //     openModal()
              //   }
            >
              <div className="flex items-center gap-2">
                <Eye />
                View
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer space-x-2"
              //   onClick={() =>
              //     openModal()
              //   }
            >
              <div className="flex items-center gap-2">
                <Download />
                Download
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer space-x-2"
              //   onClick={() =>
              //     openModal()
              //   }
            >
              <div className="flex items-center gap-2">
                <Edit />
                Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer space-x-2 text-rose-600 hover:!text-rose-600 dark:text-rose-500 dark:hover:!text-rose-500"
              //   onClick={() =>
              //     openModal()
              //   }
            >
              <div className="flex items-center gap-2">
                <Trash2 className="text-rose-600 dark:text-rose-500" />
                Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
