import React from "react";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

type Props = {
  refetch: () => void;
  isFetching: boolean;
  size?: any;
};

const RefreshButton = ({ refetch, isFetching, size }: Props) => {
  return (
    <Button
      onClick={refetch}
      disabled={isFetching}
      size={size ?? "lg"}
      className="px-4 md:px-auto"
      variant={"outline"}
    >
      <RefreshCcw className="md:mr-2 h-4 w-4" />
      <span className="hidden md:block">
        {isFetching ? "Refreshing..." : "Refresh"}
      </span>
    </Button>
  );
};

export default RefreshButton;
