"use client";

import InputField from "@/components/form/InputField"; // Assume this is in the same directory
import SelectField from "@/components/form/SelectField";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateUser } from "@/hooks/mutations/users/useCreateUser";
import { userOptions, UserSchema, UserType } from "@/types/validation/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const AddUserForm = (props: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useCreateUser({
    onSuccess: (data) => {
      if (data.success) {
        setOpen(false);
        toast.success("User added successfully");
        return;
      }

      toast.error(data.error ?? "Failed to add user");
    },
  });

  const onSubmit = (data: UserType) => {
    mutate(data);
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
          Add User
        </Button>
      }
      content={
        <div className="space-y-6 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <InputField
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
              />
              <InputField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
              />
              <SelectField
                control={form.control}
                options={userOptions}
                name="role"
                label="User Role"
                placeholder="Select Role"
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
                  Add User
                </Button>
              </div>
            </form>
          </Form>
        </div>
      }
    />
  );
};

export default AddUserForm;
