import { Link } from 'react-router-dom';
import { tenantRows } from '../../mockupData/mockupData';

const SuperAdminPage = () => {
  return (
    <div>
      <div className="page-control-head mb-4">
        <div>
          <span className="page-control-kicker">Control Center</span>
          <h2 className="page-control-title mb-1">Super Admin Dashboard</h2>
          <p className="page-control-subtitle mb-0">Monitor tenants, approvals, and platform health from one command desk.</p>
        </div>
        <Link className="btn btn-outline-primary btn-sm" to="/settings">White Label Settings</Link>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card border-0 bg-primary text-white"><div className="card-body"><h6>Tenants</h6><h3>128</h3></div></div></div>
        <div className="col-md-3"><div className="card border-0 bg-success text-white"><div className="card-body"><h6>Active Schools</h6><h3>96</h3></div></div></div>
        <div className="col-md-3"><div className="card border-0 bg-warning text-dark"><div className="card-body"><h6>Trial Schools</h6><h3>18</h3></div></div></div>
        <div className="col-md-3"><div className="card border-0 bg-info text-white"><div className="card-body"><h6>Revenue</h6><h3>$12.4k</h3></div></div></div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Tenant Management</h5>
          <table className="table table-hover align-middle">
            <thead>
              <tr><th>Name</th><th>Plan</th><th>Status</th><th>Domain</th></tr>
            </thead>
            <tbody>
              {tenantRows.map((row) => (
                <tr key={row.name}><td>{row.name}</td><td>{row.plan}</td><td><span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>{row.status}</span></td><td>{row.domain}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminPage;
