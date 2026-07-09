import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal, addTenant, deactivateTenant } from '../../redux/slices/tenantSlice';
import EduGrid from '../../common/EduGrid';
import EduModal from '../../common/EduModal';

const TenantManagementPage = () => {
  const dispatch = useDispatch();
  const { tenants, showModal } = useSelector((state) => state.tenants);

  // Define modal fields for tenant
  const modalFields = [
    {
      name: 'name',
      label: 'School Name',
      type: 'text',
      placeholder: 'Enter school name',
      required: true,
    },
    {
      name: 'domain',
      label: 'Custom Domain',
      type: 'text',
      placeholder: 'e.g., bright.edu',
      required: true,
    },
    {
      name: 'plan',
      label: 'Subscription Plan',
      type: 'select',
      required: true,
      options: [
        { value: 'Free Trial', label: 'Free Trial' },
        { value: 'Basic', label: 'Basic' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Enterprise', label: 'Enterprise' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Suspended', label: 'Suspended' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  ];

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

  const handleModalSubmit = (data) => {
    dispatch(addTenant(data));
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Tenant Management</h2>
          <button className="btn btn-primary btn-sm" onClick={() => dispatch(openModal())}>
            Add Tenant
          </button>
        </div>

        {/* Use Dynamic Grid */}
        <EduGrid columns={columns} data={tenants} actions={actions} />
      </div>

      {/* Use Dynamic Modal */}
      <EduModal
        title="Add New Tenant"
        isOpen={showModal}
        onClose={() => dispatch(closeModal())}
        onSubmit={handleModalSubmit}
        fields={modalFields}
        submitButtonText="Add Tenant"
        cancelButtonText="Cancel"
      />
    </div>
  );
}

export default TenantManagementPage;
