import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import NoData from "./no-data";

export type MessageProps = {
  message: string;
};

export type RenderItemFunction<T> = (item: T, index: number) => React.ReactNode;

interface ListProps<T> {
  data: T[] | null | undefined;
  renderItem: RenderItemFunction<T>;
  isLoading?: boolean;
  error: any;
  LoadingComponent?: React.ComponentType<MessageProps>;
  ErrorComponent?: React.ComponentType<MessageProps>;
  EmptyComponent?: React.ComponentType<MessageProps>;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  containerClassName?: string;
}

// Default Loading Component
const DefaultLoadingComponent: React.FC<MessageProps> = ({
  message = "Loading...",
}) => <NoData variant="loading" message={message} />;

// Default Error Component
const DefaultErrorComponent: React.FC<MessageProps> = ({
  message = "An error occurred. Please try again later.",
}) => <NoData variant="error" message={message} />;

// Default Empty Component
const DefaultEmptyComponent: React.FC<MessageProps> = ({
  message = "No data available.",
}) => <NoData variant="no-records" message={message} />;

function List<T>({
  data,
  renderItem,
  isLoading = false,
  error = null,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
  EmptyComponent = DefaultEmptyComponent,
  loadingMessage = "Loading...",
  errorMessage = "An error occurred. Please try again later.",
  emptyMessage = "No data available.",
  containerClassName = "grid gap-4",
}: ListProps<T>): React.ReactElement {
  if (isLoading) {
    return <LoadingComponent message={loadingMessage} />;
  }

  if (error) {
    return <ErrorComponent message={errorMessage} />;
  }

  if (!data || data.length === 0) {
    return <EmptyComponent message={emptyMessage} />;
  }

  return (
    <div className={containerClassName}>
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}

export default List;
