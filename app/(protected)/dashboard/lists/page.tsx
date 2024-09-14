import PageHeader from "@/components/layout/PageHeader";
import ListsPage from "@/pages/lists/ListsPage";

export const revalidate = 3600; // Revalidate every hour

export default async function Lists() {
  return (
    <div>
      <PageHeader
        title="Lists"
        description="View and create all your reusable lists here!"
      />
      <ListsPage />
    </div>
  );
}
