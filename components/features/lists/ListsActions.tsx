import CreateList from "./actions/CreateList";
import ShareFullList from "./actions/ShareFullList";

type Props = {};

const ListsActions = (props: Props) => {
  return (
    <div className="flex flex-wrap gap-4 md:justify-end">
      <ShareFullList />
      <CreateList />
    </div>
  );
};

export default ListsActions;
