const HomePage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">EduCoreUi ERP Starter</h2>
      <p className="text-muted">A polished multi-tenant SaaS UI for schools with white-label branding, modules, and role-based access.</p>
      <div className="row g-3 mt-2">
        <div className="col-md-4"><div className="card border-0 bg-light h-100"><div className="card-body"><h5>Authentication</h5><p className="small text-muted">JWT, refresh tokens, OTP, Google, Microsoft and 2FA-ready.</p></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light h-100"><div className="card-body"><h5>Tenant Control</h5><p className="small text-muted">School registration, branding, plans, storage and domain mapping.</p></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light h-100"><div className="card-body"><h5>School Modules</h5><p className="small text-muted">Attendance, fees, exams, homework, LMS, reports, and more.</p></div></div></div>
      </div>
    </div>
  );
}

export default HomePage;
