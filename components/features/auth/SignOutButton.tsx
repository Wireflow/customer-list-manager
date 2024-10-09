import { signOutAction } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const SignOutButton = (props: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await signOutAction();
    router.refresh();
    queryClient.invalidateQueries();
  };

  return (
    <form action={handleSignOut}>
      <SubmitButton
        type="submit"
        pendingText="Signing out..."
        variant={"ghost"}
        className="w-full justify-start "
      >
        <ArrowLeft size={20} className="mr-2" /> Sign out
      </SubmitButton>
    </form>
  );
};

export default SignOutButton;
