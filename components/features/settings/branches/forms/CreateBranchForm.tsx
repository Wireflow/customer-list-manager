"use client";

import InputField from "@/components/form/InputField"; // Assume this is in the same directory
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateBranch } from "@/hooks/mutations/branches/useCreateBranch";
import { BranchSchema, BranchType } from "@/types/validation/branches";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const CreateBranchForm = (props: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<BranchType>({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useCreateBranch({
    onSuccess: (data) => {
      if (data.success) {
        setOpen(false);
        form.reset();
        toast.success("Branch added successfully");
        return;
      }

      toast.error(data.error ?? "Failed to add branch");
    },
  });

  const onSubmit = (data: BranchType) => {
    mutate({
      name: data.name,
    });
  };

  const onCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Add User"
      description="Add a new user to this branch"
      trigger={
        <Button type="button" className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Branch
        </Button>
      }
      content={
        <div className="space-y-6 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                control={form.control}
                name="name"
                label="Branch Name"
                placeholder="Enter branch name "
              />

              <div className="flex md:flex-row flex-col justify-between gap-4 mt-4">
                <Button
                  variant={"outline"}
                  className="w-full md:w-auto"
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isPending}
                  loading={isPending}
                >
                  Create Branch
                </Button>
              </div>
            </form>
          </Form>
        </div>
      }
    />
  );
};

export default CreateBranchForm;
