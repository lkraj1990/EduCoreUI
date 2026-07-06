import { staffRows } from '../../mockupData/mockupData';

function StaffPage() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Staff Management</h2>
          <button className="btn btn-primary btn-sm">Add Staff</button>
        </div>
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th></tr></thead>
          <tbody>{staffRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.role}</td><td>{row.department}</td><td><span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>{row.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffPage;
