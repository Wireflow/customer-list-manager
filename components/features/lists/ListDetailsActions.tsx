"use client";

import { useParams } from "next/navigation";
import AddItems from "./actions/AddItems";
import DeleteList from "./actions/DeleteList";

type Props = {};

const ListDetailsActions = (props: Props) => {
  const params = useParams();
  const listId = params?.id as string;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DeleteList listId={listId} />
      <AddItems listId={listId} />
    </div>
  );
};

export default ListDetailsActions;
