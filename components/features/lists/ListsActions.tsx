import React from "react";
import CopyOptinLink from "./actions/CopyOptinLink";
import CreateList from "./actions/CreateList";
import ShareFullList from "./actions/ShareFullList";

type Props = {};

const ListsActions: React.FC<Props> = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 w-full mb-4">
      <div className="w-full sm:w-auto">
        <CopyOptinLink />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <ShareFullList />
        <CreateList />
      </div>
    </div>
  );
};

export default ListsActions;
