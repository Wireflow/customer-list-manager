import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import React from "react";

type Props = {
  user: User;
};

const DeleteUser = ({ user }: Props) => {
  return (
    <Button
      size={"sm"}
      className="text-xs"
      type="button"
      variant={"destructive"}
    >
      Delete
    </Button>
  );
};

export default DeleteUser;
