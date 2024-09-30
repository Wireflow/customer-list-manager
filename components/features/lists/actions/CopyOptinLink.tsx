import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/queries/auth/useSession";
import { copyToClipboard, getOptinLink } from "@/utils/optinUtils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const CopyOptinLink = () => {
  const { session } = useSession();

  const optinLink = getOptinLink(session?.user.user_metadata.branchId);

  const handleCopy = () => {
    copyToClipboard(optinLink);
    toast.success("Opt in link copied to clipboard!");
  };

  return (
    <Button
      size={"lg"}
      onClick={handleCopy}
      variant={"secondary"}
      className="w-full sm:w-auto"
    >
      Opt in Link <Copy className=" h-4 w-4 ml-2 " />
    </Button>
  );
};

export default CopyOptinLink;
