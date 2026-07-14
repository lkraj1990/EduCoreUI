import { Link, useParams } from 'react-router-dom';
import { erpModules } from '../../mockupData/erpModules';

const ModuleDescriptionPage = () => {
  const { moduleId } = useParams();
  const moduleRecord = erpModules.find((item) => item.id === moduleId);

  if (!moduleRecord) {
    return (
      <div className="card border-0 shadow-sm p-4">
        <h2 className="fw-bold mb-2">Module not found</h2>
        <p className="text-muted mb-3">This ERP module description is not available.</p>
        <Link to="/" className="btn btn-outline-primary btn-sm">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm module-detail-card">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <p className="landing-kicker mb-1">ERP Module</p>
            <h2 className="fw-bold mb-0">{moduleRecord.title}</h2>
          </div>
          <Link to="/" className="btn btn-outline-secondary btn-sm">Back to Home</Link>
        </div>

        <img src={moduleRecord.image} alt={moduleRecord.title} className="module-detail-image mb-4" />

        <p className="text-muted mb-4">{moduleRecord.longDescription}</p>

        <h5 className="fw-bold mb-3">Key Capabilities</h5>
        <ul className="ps-3 mb-4">
          {moduleRecord.highlights.map((point) => (
            <li key={point} className="mb-2">{point}</li>
          ))}
        </ul>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/pricing" className="btn btn-primary">Explore Plans</Link>
          <Link to="/register-school" className="btn btn-outline-primary">Start Now</Link>
        </div>
      </div>
    </div>
  );
};

export default ModuleDescriptionPage;
