import { tenantRows } from '../../mockupData/mockupData';

function TenantManagementPage() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Tenant Management</h2>
          <button className="btn btn-primary btn-sm">Add Tenant</button>
        </div>
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Plan</th><th>Status</th><th>Domain</th></tr></thead>
          <tbody>{tenantRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.plan}</td><td><span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>{row.status}</span></td><td>{row.domain}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TenantManagementPage;
