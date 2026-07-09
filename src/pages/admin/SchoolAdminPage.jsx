const SchoolAdminPage = () => {
  return (
    <div>
      <h2 className="fw-bold mb-3">School Admin Dashboard</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Students</h6><h3>1,240</h3></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Staff</h6><h3>86</h3></div></div></div>
        <div className="col-md-4"><div className="card border-0 bg-light"><div className="card-body"><h6>Fees Collected</h6><h3>$84k</h3></div></div></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h5>Academic Summary</h5><p className="text-muted mb-0">Classes, sessions, timetables and LMS modules ready for expansion.</p></div></div></div>
        <div className="col-md-6"><div className="card shadow-sm border-0 h-100"><div className="card-body"><h5>Communication Center</h5><p className="text-muted mb-0">SMS, email, WhatsApp and in-app notifications can be managed from here.</p></div></div></div>
      </div>
    </div>
  );
}

export default SchoolAdminPage;
