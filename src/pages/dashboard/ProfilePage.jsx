function ProfilePage() {
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
                    <h6 className="text-muted">Contact</h6>
                    <p className="mb-0 fw-semibold">admin@educore.com</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-muted">Role</h6>
                    <p className="mb-0 fw-semibold">School Administrator</p>
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
