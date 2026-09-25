import { auth } from "@/auth";

export const metadata = {
  title: "Settings — Nocturne Studio",
};

export default async function SettingsPage() {
  const session = await auth();

  return (
    <section>
      <h2 className="account-heading">Account Settings</h2>

      <div className="account-section">
        <div className="settings-group">
          <h3 className="settings-group__title">Account Information</h3>
          <div className="settings-group__row">
            <span className="settings-group__label">Email</span>
            <span className="settings-group__value">{session?.user?.email}</span>
          </div>
          <div className="settings-group__row">
            <span className="settings-group__label">Role</span>
            <span className="settings-group__value" style={{ textTransform: "capitalize" }}>
              {(session?.user as { role?: string })?.role?.toLowerCase() || "customer"}
            </span>
          </div>
        </div>

        <div className="settings-group">
          <h3 className="settings-group__title">Password</h3>
          <p className="settings-group__description">
            Password changes are not yet available in this version. This feature will be enabled in a future update.
          </p>
        </div>

        <div className="settings-group">
          <h3 className="settings-group__title">Preferences</h3>
          <p className="settings-group__description">
            Notification and display preferences will be available in a future update.
          </p>
        </div>
      </div>
    </section>
  );
}
