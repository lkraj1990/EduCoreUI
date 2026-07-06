import { studentRows } from '../../mockupData/mockupData';

const StudentPage = () => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Student Management</h2>
          <button className="btn btn-primary btn-sm">Add Student</button>
        </div>
        <table className="table table-hover align-middle">
          <thead><tr><th>Name</th><th>Class</th><th>Guardian</th><th>Status</th></tr></thead>
          <tbody>{studentRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.class}</td><td>{row.guardian}</td><td><span className="badge bg-success">{row.status}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}