import PageHeader from "@/components/layout/PageHeader";
import SettingsPage from "@/webpages/settings/SettingsPage";

export default async function Settings() {
  return (
    <div className="overflow-y-auto">
      <PageHeader title="Settings" description="Manage your account settings" />
      <SettingsPage />
    </div>
  );
}
