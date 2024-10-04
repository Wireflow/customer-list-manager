"use client";

import InputField from "@/components/form/InputField";
import TextareaField from "@/components/form/TextAreaField";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateGroup } from "@/hooks/mutations/groups/useCreateGroup";
import { GroupSchema, GroupType } from "@/types/validation/groups";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Users } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const CreateGroupForm = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const { mutate, isPending } = useCreateGroup({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      setOpen(false);
      toast.success("Successfully created group");
    },
  });

  const form = useForm<GroupType>({
    resolver: zodResolver(GroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: GroupType) => {
    if (!data.name) {
      form.setError("name", {
        message: "You must provide a name for the group.",
      });
    }

    mutate({
      name: data.name,
      description: data.description,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button size={"lg"} className="w-full flex-1">
          <Users className="h-4 w-4 mr-2" /> Create Group
        </Button>
      }
      title="Create Group"
      description="Create a group of accounts to share the list"
      content={
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <InputField
                name="name"
                label="Group Name"
                placeholder="ex. Customers"
                control={form.control}
              />
              <TextareaField
                name="description"
                label="Group Description"
                placeholder="ex. All customers in the company"
                control={form.control}
              />
              <Button
                type="submit"
                className="mt-4 w-full"
                size={"lg"}
                disabled={isPending || !form.formState.isValid}
                loading={isPending}
              >
                <Check className="mr-2 h-4 w-4" /> Create Group
              </Button>
            </form>
          </Form>
        </div>
      }
    />
  );
};

export default CreateGroupForm;
