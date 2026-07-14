const PlanSelect = ({
  name = 'plan',
  label = 'Plan',
  value,
  onChange,
  plans = [],
  required = false,
  disabled = false,
  error = '',
  detailsLink,
  optionValueKey = 'name',
  optionLabelKey = 'name',
}) => {
  return (
    <div>
      <label className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <select
        name={name}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Select a plan</option>
        {plans.map((plan) => (
          <option key={plan.id || plan.name} value={plan[optionValueKey] || ''}>
            {plan[optionLabelKey] || plan.name}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {detailsLink && (
        <div className="mt-2">
          {detailsLink}
        </div>
      )}
    </div>
  );
};

export default PlanSelect;
