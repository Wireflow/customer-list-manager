import React from "react";
import { AlertCircle, Ban, FileQuestion, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "no-records" | "error" | "failed" | "loading";

type NoDataProps = {
  variant?: Variant;
  message?: string;
  className?: string;
};

const variantConfig = {
  "no-records": {
    icon: FileQuestion,
    color: "text-black-600",
    defaultMessage: "No records found. Start by creating a new entry.",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-600",
    defaultMessage: "An error occurred. Please try again later.",
  },
  failed: {
    icon: Ban,
    color: "text-yellow-600",
    defaultMessage: "Operation failed. Please check your input and try again.",
  },
  loading: {
    icon: Loader2,
    color: "text-gray-600",
    defaultMessage: "Loading...",
  },
};

const NoData: React.FC<NoDataProps> = ({
  variant = "no-records",
  message,
  className,
}) => {
  const { icon: Icon, color, defaultMessage } = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-[calc(100vh-220px)]",
        className
      )}
    >
      <Icon
        className={`w-12 h-12 mb-4 ${color} ${variant === "loading" ? "animate-spin" : ""}`}
      />
      <p className="text-lg font-semibold text-center">
        {message || defaultMessage}
      </p>
    </div>
  );
};

export default NoData;
