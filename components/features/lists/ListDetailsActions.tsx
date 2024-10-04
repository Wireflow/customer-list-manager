"use client";

import { useParams } from "next/navigation";
import AddItems from "./actions/AddItems";
import DeleteList from "./actions/DeleteList";
import MarkListAsFavorite from "./actions/MarkListAsFavorite";

type Props = {};

const ListDetailsActions = (props: Props) => {
  const params = useParams();
  const listId = params?.id as string;

  return (
    <div className="flex md:flex-row flex-col gap-4 justify-between items-end ">
      <DeleteList listId={listId} />
      <div className="flex gap-4 flex-row w-full md:w-auto">
        <AddItems listId={listId} />
        <MarkListAsFavorite listId={listId} />
      </div>
    </div>
  );
};

export default ListDetailsActions;
