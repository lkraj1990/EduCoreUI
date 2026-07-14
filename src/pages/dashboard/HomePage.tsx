import { Link } from 'react-router-dom';

const planCards = [
  {
    name: 'Starter',
    price: '$29',
    detail: 'Best for emerging schools',
    points: ['Admissions and student records', 'Attendance and daily operations', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$59',
    detail: 'Built for scaling campuses',
    points: ['Fees, exams, and analytics', 'Role-based staff workflows', 'Priority implementation support'],
  },
  {
    name: 'Signature',
    price: '$99',
    detail: 'Full white-label control',
    points: ['Parent and student portals', 'Branding and domain mapping', 'Advanced reporting and governance'],
  },
];

const modules = [
  'Admissions and registration',
  'Student lifecycle management',
  'Staff and timetable operations',
  'Attendance intelligence',
  'Fees, billing, and subscriptions',
  'Exams, report cards, and analytics',
  'Parent, teacher, and student portals',
  'White-label branding and tenant control',
];

const HomePage = () => {
  return (
    <div className="landing-stack d-flex flex-column gap-4">
      <section className="landing-hero card border-0 shadow-sm overflow-hidden">
        <div className="card-body p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="status-pill mb-3">School ERP Reimagined</span>
              <h1 className="display-5 fw-bold mt-3 mb-3">One platform for every classroom, campus, and stakeholder.</h1>
              <p className="lead text-muted mb-4">
                EduCoreUi brings admissions, academics, finance, and communication into one streamlined command center for modern school operations.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/pricing" className="btn btn-primary btn-lg">Explore Plans</Link>
                <Link to="/register-school" className="btn btn-outline-primary btn-lg">Register School</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="landing-vision-card h-100">
                <p className="landing-kicker mb-2">Our Vision</p>
                <h3 className="fw-bold mb-3">Every school deserves enterprise-grade operating clarity.</h3>
                <p className="text-muted mb-4">
                  We help schools move from scattered tools and manual handoffs to one reliable digital backbone.
                </p>
                <div className="landing-motto-box">
                  <span className="landing-kicker d-block mb-2">Our Motto</span>
                  <strong>Lead smarter. Teach better. Learn faster.</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold">Mission Control</h5>
              <p className="text-muted mb-0">A single operational cockpit for principals, admins, teachers, students, and parents.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold">Decision Visibility</h5>
              <p className="text-muted mb-0">From attendance to payments, every critical metric is surfaced with role-aware access.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold">School Growth Ready</h5>
              <p className="text-muted mb-0">Multi-tenant infrastructure, white-label delivery, and scalable workflows from day one.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <p className="landing-kicker mb-1">Plan Details</p>
              <h2 className="fw-bold mb-0">Choose the operating model that matches your campus scale.</h2>
            </div>
            <Link to="/pricing" className="btn btn-outline-secondary">See Full Pricing</Link>
          </div>

          <div className="row g-3">
            {planCards.map((plan) => (
              <div className="col-lg-4" key={plan.name}>
                <div className="landing-plan-card h-100">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">{plan.name}</h4>
                      <p className="text-muted mb-0">{plan.detail}</p>
                    </div>
                    <span className="landing-plan-price">{plan.price}</span>
                  </div>
                  <ul className="mb-0 ps-3">
                    {plan.points.map((point) => (
                      <li key={point} className="mb-2">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <p className="landing-kicker mb-1">School Modules</p>
          <h2 className="fw-bold mb-4">Operational depth across the full school journey.</h2>
          <div className="row g-3">
            {modules.map((moduleName) => (
              <div className="col-md-6 col-xl-3" key={moduleName}>
                <div className="landing-module-tile h-100">
                  <span className="landing-module-dot"></span>
                  <h6 className="fw-bold mb-2 mt-3">{moduleName}</h6>
                  <p className="text-muted small mb-0">Built to reduce manual work and keep every school team aligned.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
