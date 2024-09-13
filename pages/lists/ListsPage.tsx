import ListsActions from "@/components/features/lists/ListsActions";
import ListsList from "@/components/features/lists/ListsList";
import { ListWithItems } from "@/types/schema/lists";

type ListsPageProps = {
  lists: ListWithItems[];
};

const ListsPage = ({ lists }: ListsPageProps) => {
  return (
    <div className="grid gap-8">
      <ListsActions />
      <div className="grid gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Your Lists</h1>
        <ListsList lists={lists} />
      </div>
    </div>
  );
};

export default ListsPage;
