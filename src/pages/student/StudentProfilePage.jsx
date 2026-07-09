import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { currentUser } = useAuth();
  const { students } = useSelector((state) => state.students);

  // If no studentId in URL, show current user's profile (for students accessing via My Profile)
  // If studentId in URL, show that specific student's profile (for admins viewing from grid)
  const student = studentId
    ? students.find((s) => s.name === decodeURIComponent(studentId))
    : students.find((s) => s.name === currentUser?.name);

  if (!student) {
    return (
      <div className="card shadow-sm border-0 p-4">
        <div className="alert alert-warning">Student not found</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-2">{student.name}</h2>
                <p className="text-muted mb-0">{student.class}</p>
              </div>
              <span className="badge bg-success">{student.status}</span>
            </div>

            <hr className="my-4" />

            {/* Academic Information */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Academic Information</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted mb-1">Class</h6>
                      <p className="mb-0 fw-semibold">{student.class}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted mb-1">Status</h6>
                      <p className="mb-0 fw-semibold">{student.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Guardian Information</h5>
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <h6 className="text-muted mb-1">Guardian Name</h6>
                  <p className="mb-3 fw-semibold">{student.guardian}</p>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Performance Summary</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Attendance</h6>
                      <p className="mb-0 fw-bold fs-5">94%</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Grade Average</h6>
                      <p className="mb-0 fw-bold fs-5">A</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Fee Status</h6>
                      <p className="mb-0 fw-bold fs-5 text-success">Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <button className="btn btn-primary">Edit Profile</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-primary btn-sm">View Attendance</button>
              <button className="btn btn-outline-primary btn-sm">View Grades</button>
              <button className="btn btn-outline-primary btn-sm">View Fee Details</button>
              <button className="btn btn-outline-primary btn-sm">View Documents</button>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Account Status</h5>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Registration</span>
                <span className="badge bg-success">Complete</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Documents</span>
                <span className="badge bg-warning text-dark">Pending</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Fees</span>
                <span className="badge bg-success">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
