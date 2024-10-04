"use server";

import {
  GroupAccountAssignmentType,
  GroupType,
} from "@/types/validation/groups";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createdGroup = async (data: GroupType) => {
  const session = await supabase.auth.getSession();
  const branchId = session.data.session?.user.user_metadata.branchId;

  if (!session.data.session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({ name: data.name, branchId, description: data.description })
      .single();

    if (groupError) {
      throw new Error(groupError.message);
    }

    return { success: true, data: group };
  } catch (error) {
    console.error("Error in createGroup:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const addAccountsToGroup = async (data: GroupAccountAssignmentType) => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!data.length) {
    return { success: false, error: "No accounts to add" };
  }

  try {
    const { data: insertedAssignments, error } = await supabase
      .from("group_account_assignments")
      .upsert(data, {
        onConflict: "groupId, accountId",
        ignoreDuplicates: true,
      })
      .select("*");

    if (error) {
      throw error;
    }

    // Check if any assignments were actually inserted
    if (!insertedAssignments || insertedAssignments.length === 0) {
      return {
        success: true,
        message: "All accounts were already in the group. No changes made.",
        data: [],
      };
    }

    return {
      success: true,
      data: insertedAssignments,
      message: `Successfully added ${insertedAssignments.length} account(s) to the group.`,
    };
  } catch (error) {
    console.error("Error in addAccountsToGroup:", error);
    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
};
