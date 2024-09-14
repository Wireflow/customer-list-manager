import { Database } from "@/types/supabase/database";
import { SupabaseClient } from "@supabase/supabase-js";

export type BranchFilteredClient = Omit<SupabaseClient<Database>, "from"> & {
  withBranchId: (branchId: string | null) => BranchFilteredClient;
  from: <T extends keyof Database["public"]["Tables"]>(
    table: T
  ) => BranchFilteredFrom<T>;
};

type BranchFilteredFrom<T extends keyof Database["public"]["Tables"]> = {
  [K in keyof ReturnType<SupabaseClient<Database>["from"]>]: K extends "select"
    ? (
        ...args: Parameters<ReturnType<SupabaseClient<Database>["from"]>[K]>
      ) => ReturnType<ReturnType<SupabaseClient<Database>["from"]>[K]>
    : ReturnType<SupabaseClient<Database>["from"]>[K];
};

export const BRANCH_FILTERED_TABLES = [
  "products",
  "accounts",
  "lists",
  "orders",
  "sharedLists",
  "categories",
] as const;

export type BranchFilteredTable = (typeof BRANCH_FILTERED_TABLES)[number];

export const createBranchFilteredClient = (
  baseClient: SupabaseClient<Database>,
  initialBranchId: string | null
): BranchFilteredClient => {
  let currentBranchId = initialBranchId;

  const filteredClient: BranchFilteredClient = {
    ...baseClient,
    withBranchId: (branchId: string | null) => {
      currentBranchId = branchId;
      return filteredClient;
    },
    from: <T extends keyof Database["public"]["Tables"]>(table: T) => {
      const originalFrom = baseClient.from(table);
      const shouldFilterByBranch = BRANCH_FILTERED_TABLES.includes(
        table as BranchFilteredTable
      );

      return {
        ...originalFrom,
        select: (...args: Parameters<typeof originalFrom.select>) => {
          let query = originalFrom.select(...args);
          if (shouldFilterByBranch && currentBranchId) {
            query = query.eq("branchId", currentBranchId);
          }
          return query;
        },
      } as BranchFilteredFrom<T>;
    },
  };

  Object.getOwnPropertyNames(baseClient).forEach((prop) => {
    if (!(prop in filteredClient)) {
      (filteredClient as any)[prop] = (baseClient as any)[prop];
    }
  });

  return filteredClient;
};
