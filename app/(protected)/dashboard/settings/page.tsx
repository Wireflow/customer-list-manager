import PageHeader from "@/components/layout/PageHeader";
import SettingsPage from "@/webpages/settings/SettingsPage";

export default async function Settings() {
  return (
    <div>
      <PageHeader title="Settings" />
      <SettingsPage />
    </div>
  );
}
