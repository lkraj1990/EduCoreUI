import { Link } from 'react-router-dom';

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
          <label className="form-label">Admin Mobile Number</label>
          <input className="form-control" type="tel" placeholder="+91 98765 43210" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Email</label>
          <input className="form-control" placeholder="admin@school.com" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Google Location (URL or Lat-Long)</label>
          <input
            className="form-control"
            placeholder="https://maps.google.com/... or 12.9716, 77.5946"
          />
        </div>
        <div className="col-12">
          <label className="form-label">School Address</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter complete school address"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Plan</label>
          <select className="form-select">
            <option>Free Trial</option>
            <option>Basic</option>
            <option>Standard</option>
            <option>Premium</option>
          </select>
          <div className="mt-2">
            <Link to="/register-school/plan-details" className="link-primary text-decoration-none fw-semibold">
              View Plan Details
            </Link>
          </div>
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
