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
  label: string;
  transform?: (value: any, item: T) => React.ReactNode;
  className?: string; // Changed to be a string for the entire column
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map(
            (field, index) =>
              !field?.disabled && (
                <TableHead
                  key={
                    typeof field.key === "function"
                      ? `${field.label}-${index}`
                      : (field.key as string)
                  }
                  className={field.className}
                >
                  {field.label}
                </TableHead>
              ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(item)}
              className={
                onRowClick
                  ? "cursor-pointer hover:bg-gray-100"
                  : "hover:bg-gray-100"
              }
            >
              {fields.map(
                (field, cellIndex) =>
                  !field.disabled && (
                    <TableCell
                      key={
                        typeof field.key === "function"
                          ? `${field.label}-${rowIndex}-${cellIndex}`
                          : (field.key as string)
                      }
                      className={`py-3 ${field.className || ""} `}
                    >
                      {renderCellValue(item, field)}
                    </TableCell>
                  ),
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={fields.length} className="py-4 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DynamicTable;
