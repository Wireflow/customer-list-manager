import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export interface TableField<T> {
  key: NestedKeyOf<T> | ((item: T) => React.ReactNode);
  label: string | ((item: T) => React.ReactNode);
  transform?: (value: any, item: T) => React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface DynamicTableProps<T> {
  fields: TableField<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

const getNestedValue = <T,>(obj: T, path: string): any => {
  return path
    .split(".")
    .reduce((acc: any, part: string) => acc && acc[part], obj);
};

export function DynamicTable<T extends Record<string, any>>({
  fields,
  data,
  onRowClick,
  emptyMessage = "No records found",
}: DynamicTableProps<T>) {
  const renderCellValue = (item: T, field: TableField<T>) => {
    let value: any;

    if (typeof field.key === "function") {
      value = field.key(item);
    } else {
      value = getNestedValue(item, field.key as string);
    }

    if (field.transform) {
      return field.transform(value, item);
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    if (typeof value === "number") {
      return value.toString();
    }

    return value ?? "N/A";
  };

  const renderLabel = (field: TableField<T>, index: number) => {
    if (typeof field.label === "function") {
      return field.label({} as T);
    }
    return field.label;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {fields.map(
              (field, index) =>
                !field?.disabled && (
                  <TableHead
                    key={
                      typeof field.key === "function"
                        ? `${index}-${typeof field.label === "function" ? index : field.label}`
                        : (field.key as string)
                    }
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider ${field.className}`}
                  >
                    {renderLabel(field, index)}
                  </TableHead>
                )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  ${onRowClick ? "cursor-pointer" : ""}
                  transition-colors hover:bg-gray-50
                  ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                `}
              >
                {fields.map(
                  (field, cellIndex) =>
                    !field.disabled && (
                      <TableCell
                        key={
                          typeof field.key === "function"
                            ? `${rowIndex}-${cellIndex}`
                            : (field.key as string)
                        }
                        className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${field.className || ""}`}
                      >
                        {renderCellValue(item, field)}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={fields.length}
                className="px-2 sm:px-4 py-4 sm:py-8 text-center text-gray-500 text-sm"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DynamicTable;
