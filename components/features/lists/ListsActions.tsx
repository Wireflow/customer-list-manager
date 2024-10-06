import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import React from "react";
import SelectShareType from "../shared-lists/forms/SelectShareType";
import CopyOptinLink from "./actions/CopyOptinLink";
import CreateList from "./actions/CreateList";

type Props = {};

const ListsActions: React.FC<Props> = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 w-full mb-4">
      <div className="w-full sm:w-auto">
        <CopyOptinLink />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <SelectShareType
          trigger={
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Share className="mr-2 h-4 w-4 -ml-2" /> Share Full List
            </Button>
          }
        />
        <CreateList />
      </div>
    </div>
  );
};

export default ListsActions;
