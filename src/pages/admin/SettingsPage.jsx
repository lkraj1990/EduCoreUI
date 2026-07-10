const SettingsPage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="page-control-head mb-3">
        <div>
          <span className="page-control-kicker">Control Center</span>
          <h2 className="page-control-title mb-1">White Label Settings</h2>
          <p className="page-control-subtitle mb-0">Configure branding, integrations, and tenant-level platform identity.</p>
        </div>
      </div>
      <p className="text-muted mb-0">Tenant branding, SMTP, SMS, WhatsApp, storage, payment gateway and role permission configuration will appear here.</p>
    </div>
  );
}

export default SettingsPage;
