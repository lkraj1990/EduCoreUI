import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deactivateTenant } from '../../redux/slices/tenantSlice';
import EduGrid from '../../common/EduGrid';

const TenantManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tenants } = useSelector((state) => state.tenants);

  // Define grid columns
  const columns = [
    {
      key: 'name',
      label: 'School Name',
    },
    {
      key: 'plan',
      label: 'Plan',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      render: (value) => (
        <span className={`badge ${value === 'Active' ? 'bg-success' : value === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'domain',
      label: 'Domain',
    },
  ];

  const actions = [
    {
      label: 'Deactivate',
      onClick: (row) => {
        if (row.status !== 'Inactive') {
          if (window.confirm(`Are you sure you want to deactivate ${row.name}?`)) {
            dispatch(deactivateTenant(row.name));
          }
        } else {
          alert('Tenant is already inactive');
        }
      },
      className: 'btn-outline-warning',
    },
  ];

  return (
    <div className="card tenant-page-card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="tenant-toolbar mb-4">
          <div>
            <h2 className="fw-bold mb-1">Tenant Management</h2>
            <p className="text-muted mb-0">Manage all onboarded schools, plans, and lifecycle status.</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="tenant-count-pill">{tenants.length} Tenants</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/tenant-management/add')}>
              Add Tenant
            </button>
          </div>
        </div>

        <div className="tenant-grid-shell">
          <EduGrid columns={columns} data={tenants} actions={actions} />
        </div>
      </div>
    </div>
  );
}

export default TenantManagementPage;
