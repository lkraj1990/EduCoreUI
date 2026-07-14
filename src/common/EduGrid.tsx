const EduGrid = ({ columns, data, onRowClick, actions }) => {
  /**
   * EduGrid Component
   * 
   * Dynamic grid component that renders tables based on configuration
   * 
   * Props:
   * @param {Array} columns - Array of column configuration objects
   *   Example: [
   *     { key: 'name', label: 'Name', sortable: true },
   *     { key: 'class', label: 'Class' },
   *     { key: 'status', label: 'Status', render: (value) => <badge>{value}</badge> }
   *   ]
   * @param {Array} data - Array of data objects to display
   * @param {Function} onRowClick - Callback when row is clicked (optional)
   * @param {Array} actions - Array of action buttons [{ label: 'View', onClick: () => {} }] (optional)
   */

  if (!columns || !data) {
    return <div className="alert alert-warning">Invalid grid configuration</div>;
  }

  if (data.length === 0) {
    return <div className="alert alert-info">No data available</div>;
  }

  const renderActionContent = (action) => {
    if (action.renderIcon) {
      return action.renderIcon();
    }

    if (action.icon) {
      return <span aria-hidden="true">{action.icon}</span>;
    }

    return action.label;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.sortable ? 'cursor-pointer' : ''}>
                {column.label}
                {column.sortable && <span className="ms-1">↕</span>}
              </th>
            ))}
            {actions && actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            (() => {
              const visibleActions = actions ? actions.filter((action) => action.isVisible ? action.isVisible(row) : true) : [];

              return (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : column.type === 'badge'
                    ? <span className={`badge ${column.badgeClass || 'bg-success'}`}>
                        {row[column.key]}
                      </span>
                    : column.type === 'link'
                    ? <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          column.onClick && column.onClick(row);
                        }}
                        className="text-primary text-decoration-none fw-semibold"
                      >
                        {row[column.key]}
                      </a>
                    : row[column.key]}
                </td>
              ))}
              {visibleActions.length > 0 && (
                <td>
                  <div className="d-flex gap-1">
                    {visibleActions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        type="button"
                        className={`btn btn-sm ${action.iconOnly ? 'd-inline-flex align-items-center justify-content-center' : ''} ${action.className || 'btn-outline-primary'}`.trim()}
                        title={action.tooltip || action.label}
                        aria-label={action.ariaLabel || action.tooltip || action.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        {renderActionContent(action)}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
              );
            })()
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EduGrid;
