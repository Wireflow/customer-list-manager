import PageHeader from "@/components/layout/PageHeader";
import HomePage from "@/webpages/home/HomePage";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  return (
    <div>
      <PageHeader title="Home" description="View Latest Orders, Accounts and Shared Lists" />
      <HomePage />
    </div>
  );
}
