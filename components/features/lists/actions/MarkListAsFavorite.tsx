import { Button } from "@/components/ui/button";
import { useUpdateList } from "@/hooks/mutations/lists/useUpdateList";
import { useListById } from "@/hooks/queries/lists/useListById";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  listId: string;
};

const MarkListAsFavorite = ({ listId }: Props) => {
  const { data: list } = useListById(listId);

  const { mutate, isPending } = useUpdateList(listId)({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error ?? "Failed to changed favorite status");
        return;
      }
      toast.success("Successfully changed favorite status");
    },
  });

  return (
    <Button
      disabled={isPending}
      size={"icon"}
      variant={"ghost"}
      className="px-0"
    >
      <Heart
        className={cn({
          "stroke-black fill-white": !list?.favorited,
          "stroke-red-500 fill-red-500": list?.favorited,
        })}
        size={30}
        onClick={() => mutate({ favorited: !list?.favorited })}
      />
    </Button>
  );
};

export default MarkListAsFavorite;
