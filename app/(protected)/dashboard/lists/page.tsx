// app/dashboard/lists/page.tsx
import { createClient } from "@/utils/supabase/server";
import PageHeader from "@/components/layout/PageHeader";
import ListsPage from "@/pages/lists/ListsPage";
import NoData from "@/components/ui/no-data";

export const revalidate = 3600; // Revalidate every hour

export default async function Lists() {
  const supabase = createClient();

  const { data: lists, error } = await supabase.from("lists").select(`
    *,
    items:listItems(*)
  `);

  return (
    <div>
      <PageHeader
        title="Lists"
        description="View and create all your reusable lists here!"
      />

      {error ? (
        <NoData
          variant="error"
          message="Unable to fetch lists. Please try again later."
        />
      ) : lists && lists.length > 0 ? (
        <ListsPage lists={lists} />
      ) : (
        <NoData
          variant="no-records"
          message="No lists found. Create your first list to get started!"
        />
      )}
    </div>
  );
}
