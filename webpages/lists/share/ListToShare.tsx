import ListCard from "@/components/features/lists/ListCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoData from "@/components/ui/no-data";
import { useSession } from "@/hooks/queries/auth/useSession";
import { useListById } from "@/hooks/queries/lists/useListById";
import { useProductsCountByFilter } from "@/hooks/queries/products/useProductsCount";

type Props = {
  listId?: string;
};

const ListToShare = ({ listId }: Props) => {
  const { session } = useSession();

  const { data: list, isFetching } = useListById(listId ?? "");
  const { data: productsCount } = useProductsCountByFilter({
    branchId: session?.user.user_metadata.branchId ?? "",
  });

  return list && listId ? (
    isFetching ? (
      <NoData variant="loading" />
    ) : (
      <ListCard list={list} disableEdit disableShare />
    )
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          Complete Inventory
          <Badge variant="secondary">Full Catalog</Badge>
        </CardTitle>
        <CardDescription>
          {productsCount ?? 0} Items Ready to Share
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ListToShare;
