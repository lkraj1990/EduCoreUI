import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '$29/month',
    billingCycle: 'Monthly',
    studentLimit: 'Up to 500',
    staffLimit: 'Up to 40',
    storage: '25 GB',
    support: 'Business hours support',
    modules: ['Student Management', 'Attendance', 'Basic Reports'],
  },
  {
    name: 'Standard',
    price: '$59/month',
    billingCycle: 'Monthly',
    studentLimit: 'Up to 1500',
    staffLimit: 'Up to 100',
    storage: '75 GB',
    support: 'Priority email support',
    modules: ['Student Management', 'Attendance', 'Fees', 'Exams', 'Reports'],
  },
  {
    name: 'Premium',
    price: '$99/month',
    billingCycle: 'Monthly',
    studentLimit: 'Unlimited',
    staffLimit: 'Unlimited',
    storage: '200 GB',
    support: 'Priority support (24x7)',
    modules: ['Student Management', 'Attendance', 'Fees', 'Exams', 'Reports', 'Parent Portal'],
  },
];

const PlanDetailsPage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="fw-bold mb-0">Plan Details</h2>
        <Link to="/register-school" className="btn btn-outline-secondary btn-sm">Back to Register School</Link>
      </div>

      <p className="text-muted mb-4">
        Review available subscription plans before final registration.
      </p>

      <div>
        <h5 className="fw-semibold mb-3">Available Plans</h5>
        <div className="row g-3">
          {plans.map((plan) => (
            <div className="col-lg-4" key={plan.name}>
              <div className="border rounded p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">{plan.name}</h6>
                  <span className="badge text-bg-primary">{plan.price}</span>
                </div>
                <p className="mb-1"><strong>Billing:</strong> {plan.billingCycle}</p>
                <p className="mb-1"><strong>Students:</strong> {plan.studentLimit}</p>
                <p className="mb-1"><strong>Staff:</strong> {plan.staffLimit}</p>
                <p className="mb-1"><strong>Storage:</strong> {plan.storage}</p>
                <p className="mb-2"><strong>Support:</strong> {plan.support}</p>

                <p className="mb-1 fw-semibold">Included Modules</p>
                <ul className="mb-0 ps-3">
                  {plan.modules.map((moduleName) => (
                    <li key={moduleName}>{moduleName}</li>
                  ))}
                </ul>

                <div className="mt-3">
                  <Link
                    to={`/register-school?plan=${encodeURIComponent(plan.name.toLowerCase())}`}
                    className="btn btn-primary btn-sm"
                  >
                    Avail Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsPage;
