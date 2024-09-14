import { Database } from "@/types/supabase/database";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const getUserBranchId = async () => {
  const client = createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.user_metadata.branchId;
};
