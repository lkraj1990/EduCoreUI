import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer creative-footer">
      <div className="footer-aurora"></div>
      <div className="footer-top-glow"></div>

      <div className="footer-grid">
        <div className="footer-brand-block">
          <div className="footer-brand-head mb-2">
            <span className="footer-brand-dot"></span>
            <h6 className="footer-brand-title mb-0">EduCoreUi Orbit</h6>
          </div>
          <p className="footer-brand-text mb-2">
            One cockpit for principals, admins, teachers, students, and parents.
          </p>
          <p className="footer-mini-note mb-0">Built for high-velocity school operations.</p>
        </div>

        <div className="footer-links-block">
          <span className="footer-label">Launchpad</span>
          <div className="footer-links">
            <Link to="/home" className="footer-link">Home</Link>
            <Link to="/tenant-management" className="footer-link">Tenants</Link>
            <Link to="/school-registration" className="footer-link">Registrations</Link>
            <Link to="/pricing" className="footer-link">Plans</Link>
          </div>
        </div>

        <div className="footer-pulse-block">
          <span className="footer-label">Campus Pulse</span>
          <div className="footer-pulse-list">
            <span className="footer-pulse-item">Admissions</span>
            <span className="footer-pulse-item">Attendance</span>
            <span className="footer-pulse-item">Fee Intelligence</span>
            <span className="footer-pulse-item">Exam Analytics</span>
          </div>
        </div>

        <div className="footer-badges-block">
          <span className="footer-label">Live Snapshot</span>
          <div className="footer-metrics">
            <div className="footer-metric-tile">
              <strong>99.9%</strong>
              <span>Uptime</span>
            </div>
            <div className="footer-metric-tile">
              <strong>24x7</strong>
              <span>Monitoring</span>
            </div>
            <div className="footer-metric-tile">
              <strong>Secure</strong>
              <span>RBAC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <small className="text-muted">EduCoreUi © 2026. Crafted for modern school systems.</small>
      </div>
    </footer>
  );
}

export default Footer;
