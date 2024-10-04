import NoData from "@/components/ui/no-data";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return <NoData variant="loading" message="Loading..." />;
};

export default loading;
