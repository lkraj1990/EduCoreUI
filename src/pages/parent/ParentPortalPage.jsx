function ParentPortalPage() {
  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Parent Portal</h2>
      <p className="text-muted">Track child attendance, fee payments, assignments, and school notices.</p>
      <div className="row g-3">
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Fee Status</h5><p className="text-muted mb-0">Next payment due in 6 days</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Recent Notices</h5><p className="text-muted mb-0">PTM scheduled on Friday</p></div></div></div>
      </div>
    </div>
  );
}

export default ParentPortalPage;
