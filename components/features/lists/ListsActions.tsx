import { Button } from "@/components/ui/button";
import React from "react";
import { Share, PlusCircle } from "lucide-react";

type Props = {};

const ListsActions = (props: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" size="lg" className="w-full sm:w-auto">
        <Share className="mr-2 h-4 w-4 -ml-2" /> Share Full List
      </Button>
      <Button size="lg" className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> New Custom List
      </Button>
    </div>
  );
};

export default ListsActions;
