import { Link, useParams } from 'react-router-dom';
import { schoolRegistrationRequests } from '../../mockupData/mockupData';

const SchoolRegistrationDetailsPage = () => {
  const { schoolId } = useParams();
  const school = schoolRegistrationRequests.find((item) => item.id === schoolId);

  if (!school) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-2">School Details</h2>
          <p className="text-muted mb-3">Requested school details not found.</p>
          <Link to="/school-registration" className="btn btn-outline-secondary btn-sm">
            Back to School Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">{school.school}</h2>
            <p className="text-muted mb-0">School registration request details</p>
          </div>
          <Link to="/school-registration" className="btn btn-outline-secondary btn-sm">
            Back to School Registration
          </Link>
        </div>

        <div className="row g-3">
          <div className="col-md-6"><p className="mb-1"><strong>Admin Name:</strong> {school.admin}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Admin Email:</strong> {school.adminEmail}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Admin Mobile:</strong> {school.adminMobile}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Plan:</strong> {school.plan}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Status:</strong> {school.status}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Location:</strong> {school.location}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>School Strength:</strong> {school.strength}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Board:</strong> {school.board}</p></div>
          <div className="col-md-6"><p className="mb-1"><strong>Submitted On:</strong> {school.submittedOn}</p></div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistrationDetailsPage;
