"use client";

import { createList } from "@/actions/lists";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};

const CreateList = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-list"],
    mutationFn: createList,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to create list!");
        return;
      }

      toast.success("List created!");
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      router.push(`/dashboard/lists/${data.data?.id}?new=true`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create list!");
    },
  });

  const onCreate = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    mutate({
      name,
      branchId: session?.user.user_metadata?.branchId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4 -ml-2" /> New Custom List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
          <DialogDescription>
            Begin this list by choosing the name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>List Name</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="List name ex. 'Vapes' "
          />
          <p className="text-xs text-gray-500">
            This name will be used as label for the list.
          </p>
        </div>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button variant={"outline"} disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending || !name} onClick={onCreate}>
            {isPending ? "Creating..." : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateList;
