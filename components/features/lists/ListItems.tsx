import { deleteListItem } from "@/actions/listItems";
import { ListItemWithProduct } from "@/types/schema/listItems";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "../products/ProductCard";

type Props = {
  items: ListItemWithProduct[];
  onItemsSelect?: (items: ItemSelection) => void;
  listId: string;
};

type ItemSelection = Record<string, boolean>;

const ListItems = ({ items, onItemsSelect, listId }: Props) => {
  const [checked, setChecked] = useState<ItemSelection>({});

  const queryClient = useQueryClient();

  const handleChecked = (id: number) => {
    setChecked({
      ...checked,
      [id.toString()]: !checked[id],
    });
  };

  useEffect(() => {
    onItemsSelect?.(checked);
  }, [checked, onItemsSelect]);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteListItem,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to remove item from list!");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      toast.success("Item removed from list!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item from list!");
    },
  });

  return (
    <div>
      <p className="font-semibold mb-2">Items ({items.length || 0})</p>
      <div className="grid gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <ProductCard
              product={item?.product}
              key={item.id}
              onClick={() => handleChecked(item.id)}
              disableSelect={true}
              onChecked={(e) => {
                e.stopPropagation();
                handleChecked(item.id);
              }}
              onDelete={() => mutate(item.id)}
              isDeleting={isPending}
            />
          ))
        ) : (
          <div className="flex flex-col gap-1 items-start mt-2 h-full">
            <p>This list doesn't have any items added</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItems;
