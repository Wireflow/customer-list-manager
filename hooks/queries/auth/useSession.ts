import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";

const supabase = createClient();

const fetchSession = async (): Promise<Session | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const useSession = () => {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery<Session | null, Error>({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  // Set up listener for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Invalidate and refetch session when auth state changes
      queryClient.invalidateQueries({ queryKey: ["session"] });
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, isLoading, error };
};
