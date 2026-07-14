import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect students to their student profile page
  if (currentUser?.role === 'student') {
    navigate(`/student-profile/${encodeURIComponent(currentUser.name)}`);
    return null;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="fw-bold mb-3">My Profile</h2>
            <p className="text-muted">Manage personal account details, role information, and security preferences.</p>
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Name</h6>
                    <p className="mb-0 fw-semibold">{currentUser?.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Email</h6>
                    <p className="mb-0 fw-semibold">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Role</h6>
                    <p className="mb-0 fw-semibold">{currentUser?.role?.replace('-', ' ').toUpperCase()}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Tenant</h6>
                    <p className="mb-0 fw-semibold">{currentUser?.tenant}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
