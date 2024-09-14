import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import CreateList from "./actions/CreateList";
import ShareFullList from "./actions/ShareFullList";

type Props = {};

const ListsActions = (props: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      <ShareFullList />
      <CreateList />
    </div>
  );
};

export default ListsActions;
