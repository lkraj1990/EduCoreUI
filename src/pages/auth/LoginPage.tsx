import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('superadmin@educore.com');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(email, password, token);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate('/home');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-lg-5">
            <h2 className="fw-bold mb-2">Welcome to EduCoreUi</h2>
            <p className="text-muted mb-4">Secure sign-in for school admins, teachers, and parents.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@school.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
              </div>
              <div className="mb-3">
                <label className="form-label">Bearer Token <span className="text-muted small">(optional)</span></label>
                <input
                  className="form-control"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Paste API token if secured endpoints require it"
                />
                <div className="form-text">Stored locally and attached to API requests as an Authorization header.</div>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label" htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="small">Forgot password?</a>
              </div>
              <button className="btn btn-primary w-100" type="submit">Sign In</button>
            </form>
            <div className="mt-4 text-center text-muted small">
              Demo accounts: superadmin@educore.com, schooladmin@educore.com, teacher@educore.com, student@educore.com, parent@educore.com · password: admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
