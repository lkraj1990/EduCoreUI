function AccessDeniedPage({ currentUser }) {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card border-danger shadow-sm">
          <div className="card-body p-4 text-center">
            <h2 className="fw-bold mb-3">Access Denied</h2>
            <p className="text-muted mb-4">
              {currentUser
                ? `The ${currentUser.role.replace('-', ' ')} account does not have access to this section.`
                : 'Please sign in to continue.'}
            </p>
            <a href="/" className="btn btn-primary">
              Return to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
