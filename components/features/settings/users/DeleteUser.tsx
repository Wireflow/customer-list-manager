"use client";

import { Button } from "@/components/ui/button";
import DangerDialog from "@/components/ui/danger-dialog";
import { useDeleteUser } from "@/hooks/mutations/users/useDeleteUser";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

type Props = {
  user: User;
};

const DeleteUser = ({ user }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteUser({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("User deleted successfully");
        return;
      }
      toast.error(data.error ?? "Failed to delete user");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", user.user_metadata.branchId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const handleDelete = async () => {
    if (user) {
      mutate(user.id);
    }
  };

  return (
    <DangerDialog
      trigger={
        <Button
          size={"sm"}
          className="text-xs w-fit"
          type="button"
          variant={"destructive"}
          disabled={!user || isPending}
          loading={isPending}
        >
          Delete
        </Button>
      }
      onConfirm={handleDelete}
      disabled={!user || isPending}
      title="Delete User?"
      description={`Are you sure you want to delete ${user?.email}?`}
    />
  );
};

export default DeleteUser;
