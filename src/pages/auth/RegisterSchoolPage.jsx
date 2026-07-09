const RegisterSchoolPage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Register School</h2>
      <p className="text-muted">Onboard a new school into the EduCoreUi SaaS platform.</p>
      <form className="row g-3">
        <div className="col-md-6">
          <label className="form-label">School Name</label>
          <input className="form-control" placeholder="Bright Future School" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Email</label>
          <input className="form-control" placeholder="admin@school.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Plan</label>
          <select className="form-select">
            <option>Free Trial</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Custom Domain</label>
          <input className="form-control" placeholder="bright.edu" />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Create School</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterSchoolPage;
