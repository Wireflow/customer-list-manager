"use client";

import { deleteList } from "@/actions/lists";
import { Button } from "@/components/ui/button";
import DangerDialog from "@/components/ui/danger-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteList = ({ listId }: { listId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-list"],
    mutationFn: deleteList,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to delete list!");
      }

      queryClient.invalidateQueries({ queryKey: ["lists"] });
      router.back();
      router.refresh();

      toast.success("List deleted!");
    },
    onError: () => {
      toast.error("Failed to delete list!");
    },
  });

  return (
    <DangerDialog
      title="Delete List"
      description="This will delete the list permanently"
      disabled={isPending}
      trigger={
        <Button variant={"destructive"} disabled={isPending}>
          {isPending ? "Deleting..." : "Delete list"}
        </Button>
      }
      onConfirm={() => mutate(listId)}
    />
  );
};

export default DeleteList;
