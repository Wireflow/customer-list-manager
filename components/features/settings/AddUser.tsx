import InputField from "@/components/form/InputField"; // Assume this is in the same directory
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserSchema, UserType } from "@/types/validation/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
  branchId: string;
  onSubmit: (data: UserType) => void;
};

const AddUser = ({ branchId, onSubmit }: Props) => {
  const form = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = (data: UserType) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add User to Branch {branchId}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
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
            placeholder="Enter your password"
          />
          <InputField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
          />
          <Button type="submit">Add User</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddUser;
