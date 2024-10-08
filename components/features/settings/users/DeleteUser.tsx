"use client";

import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/mutations/users/useDeleteUser";
import { User } from "@supabase/supabase-js";
import React from "react";

type Props = {
  user: User;
};

const DeleteUser = ({ user }: Props) => {
  const { mutate, isPending } = useDeleteUser();

  const handleDelete = async () => {
    if (user) {
      mutate(user.id);
    }
  };

  return (
    <Button
      size={"sm"}
      className="text-xs"
      type="button"
      variant={"destructive"}
      disabled={!user || isPending}
      onClick={handleDelete}
      loading={isPending}
    >
      Delete
    </Button>
  );
};

export default DeleteUser;
