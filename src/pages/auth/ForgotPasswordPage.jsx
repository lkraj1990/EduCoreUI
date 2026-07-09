const ForgotPasswordPage = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-5">
        <div className="card shadow-sm border-0 p-4">
          <h2 className="fw-bold mb-2">Forgot Password</h2>
          <p className="text-muted">Enter your email to receive a reset link.</p>
          <form>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input className="form-control" placeholder="you@example.com" />
            </div>
            <button className="btn btn-primary w-100">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
