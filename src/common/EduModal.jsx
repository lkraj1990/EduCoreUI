import { useState } from 'react';

const EduModal = ({ title, isOpen, onClose, onSubmit, fields, submitButtonText = 'Submit', cancelButtonText = 'Cancel' }) => {
  /**
   * EduModal Component - Dynamic Modal for Form Handling
   * 
   * Props:
   * @param {string} title - Modal title
   * @param {boolean} isOpen - Control modal visibility
   * @param {Function} onClose - Callback to close modal
   * @param {Function} onSubmit - Callback when form is submitted (receives formData)
   * @param {Array} fields - Array of field configuration objects
   *   Example: [
   *     { name: 'firstName', label: 'First Name', type: 'text', required: true },
   *     { name: 'email', label: 'Email', type: 'email', required: true },
   *     { name: 'country', label: 'Country', type: 'select', required: true, 
   *       options: [{ value: 'IN', label: 'India' }, { value: 'US', label: 'USA' }] },
   *     { name: 'skills', label: 'Skills', type: 'multiselect', required: true,
   *       options: [{ value: 'react', label: 'React' }, { value: 'node', label: 'Node.js' }] },
   *     { name: 'description', label: 'Description', type: 'textarea' },
   *     { name: 'active', label: 'Active', type: 'checkbox' }
   *   ]
   * @param {string} submitButtonText - Text for submit button
   * @param {string} cancelButtonText - Text for cancel button
   */

  const [formData, setFormData] = useState(initializeFormData(fields));
  const [errors, setErrors] = useState({});

  function initializeFormData(fields) {
    const data = {};
    fields.forEach((field) => {
      if (field.type === 'multiselect') {
        data[field.name] = [];
      } else if (field.type === 'checkbox') {
        data[field.name] = false;
      } else {
        data[field.name] = '';
      }
    });
    return data;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleMultiselectChange = (e, fieldName) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({
      ...formData,
      [fieldName]: selectedOptions,
    });
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required) {
        if (field.type === 'multiselect') {
          if (!formData[field.name] || formData[field.name].length === 0) {
            newErrors[field.name] = `${field.label} is required`;
          }
        } else if (!formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData(initializeFormData(fields));
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fields.map((field) => (
                <div key={field.name} className="mb-3">
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="text-danger ms-1">*</span>}
                  </label>

                  {/* Text, Email, Password, Number Input */}
                  {['text', 'email', 'password', 'number', 'date'].includes(field.type) && (
                    <>
                      <input
                        type={field.type}
                        className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                        name={field.name}
                        placeholder={field.placeholder || ''}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                      />
                      {errors[field.name] && (
                        <div className="invalid-feedback d-block">{errors[field.name]}</div>
                      )}
                    </>
                  )}

                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <>
                      <textarea
                        className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                        name={field.name}
                        rows={field.rows || 3}
                        placeholder={field.placeholder || ''}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                      ></textarea>
                      {errors[field.name] && (
                        <div className="invalid-feedback d-block">{errors[field.name]}</div>
                      )}
                    </>
                  )}

                  {/* Select Dropdown */}
                  {field.type === 'select' && (
                    <>
                      <select
                        className={`form-select ${errors[field.name] ? 'is-invalid' : ''}`}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select {field.label} --</option>
                        {field.options &&
                          field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                      {errors[field.name] && (
                        <div className="invalid-feedback d-block">{errors[field.name]}</div>
                      )}
                    </>
                  )}

                  {/* Multiselect */}
                  {field.type === 'multiselect' && (
                    <>
                      <select
                        multiple
                        className={`form-select ${errors[field.name] ? 'is-invalid' : ''}`}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={(e) => handleMultiselectChange(e, field.name)}
                      >
                        {field.options &&
                          field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                      {errors[field.name] && (
                        <div className="invalid-feedback d-block">{errors[field.name]}</div>
                      )}
                    </>
                  )}

                  {/* Checkbox */}
                  {field.type === 'checkbox' && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={field.name}
                        name={field.name}
                        checked={formData[field.name]}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor={field.name}>
                        {field.label}
                      </label>
                    </div>
                  )}

                  {/* Radio Buttons */}
                  {field.type === 'radio' && (
                    <div>
                      {field.options &&
                        field.options.map((option) => (
                          <div key={option.value} className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`${field.name}-${option.value}`}
                              name={field.name}
                              value={option.value}
                              checked={formData[field.name] === option.value}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor={`${field.name}-${option.value}`}>
                              {option.label}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                {cancelButtonText}
              </button>
              <button type="submit" className="btn btn-primary">
                {submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EduModal;
