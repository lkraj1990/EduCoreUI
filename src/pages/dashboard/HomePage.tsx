import { Link } from 'react-router-dom';
import { erpModules } from '../../mockupData/erpModules';

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
                EduCoreUi is a subscription-based School ERP solution that unifies admissions, academics,
                operations, finance, and stakeholder communication in one system.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/pricing" className="btn btn-primary btn-lg">Explore Plans</Link>
                <Link to="/register-school" className="btn btn-outline-primary btn-lg">Start Now</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="landing-vision-card h-100">
                <h3 className="fw-bold mb-3">Our Vision</h3>
                <p className="landing-kicker mb-2">Every school deserves enterprise-grade operating clarity.</p>
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

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <p className="landing-kicker mb-1">School Modules</p>
          <h2 className="fw-bold mb-4">Explore ERP modules by function.</h2>
          <div className="row g-3">
            {erpModules.map((moduleItem) => (
              <div className="col-md-6 col-xl-3" key={moduleItem.id}>
                <Link
                  to={`/erp-modules/${moduleItem.id}`}
                  className="landing-module-link"
                  aria-label={`Open ${moduleItem.title} module details`}
                >
                  <div className="landing-module-tile h-100">
                    <img src={moduleItem.image} alt={moduleItem.title} className="landing-module-image" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
