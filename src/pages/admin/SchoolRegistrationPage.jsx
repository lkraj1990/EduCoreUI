import { Link } from 'react-router-dom';
import { schoolRegistrationRequests } from '../../mockupData/mockupData';

const SchoolRegistrationPage = () => {

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="fw-bold mb-3">School Registration</h2>
        <table className="table table-hover align-middle">
          <thead><tr><th>School</th><th>Admin</th><th>Plan</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {schoolRegistrationRequests.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    to={`/school-registration/${item.id}`}
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    {item.school}
                  </Link>
                </td>
                <td>{item.admin}</td>
                <td>{item.plan}</td>
                <td><span className="badge bg-warning text-dark">{item.status}</span></td>
                <td><button className="btn btn-sm btn-success me-2">Approve</button><button className="btn btn-sm btn-outline-danger">Reject</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchoolRegistrationPage;
