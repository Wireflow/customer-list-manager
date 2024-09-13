import { deleteListItem } from "@/actions/listItems";
import SubmitButton from "@/components/form/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListItemWithProduct } from "@/types/schema/listItems";
import { formatCurrency } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  items: ListItemWithProduct[];
  onItemsSelect?: (items: ItemSelection) => void;
  disableSelect?: boolean;
};

type ItemSelection = Record<string, boolean>;

const ListItems = ({ items, onItemsSelect, disableSelect = false }: Props) => {
  const [checked, setChecked] = useState<ItemSelection>({});

  const router = useRouter();

  const handleChecked = (id: number) => {
    setChecked({
      ...checked,
      [id.toString()]: !checked[id],
    });
  };

  useEffect(() => {
    onItemsSelect?.(checked);
  }, [checked]);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteListItem,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to remove item from list!");
        return;
      }

      toast.success("Item removed from list!");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to remove item from list!");
    },
  });

  return (
    <div>
      <p className="font-semibold mb-2">Items</p>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card onClick={() => handleChecked(item.id)} className="shadow-none">
            <CardContent className="p-2 px-6 flex flex-row items-center justify-between">
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 items-center">
                  {!disableSelect ? (
                    <Checkbox
                      checked={checked[item.id]}
                      onClick={() => handleChecked(item.id)}
                    />
                  ) : null}
                  <Image
                    src={item?.product?.imageUrl || ""}
                    alt="image"
                    objectFit="contain"
                    width={75}
                    height={75}
                  />
                </div>

                <div className="flex flex-col">
                  <CardTitle className="text-lg capitalize">
                    {item?.product?.name}{" "}
                    <span className="text-gray-500 font-normal">
                      ({item?.product?.unit})
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {formatCurrency(item?.product?.price)}
                  </CardDescription>
                </div>
              </div>

              <form>
                <SubmitButton
                  variant={"outline"}
                  pendingText="Deleting..."
                  pending={isPending}
                  onClick={() => mutate(item.id)}
                >
                  <Trash size={20} />
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListItems;
