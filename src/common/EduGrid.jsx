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
              {actions && actions.length > 0 && (
                <td>
                  <div className="d-flex gap-1">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className={`btn btn-sm ${action.className || 'btn-outline-primary'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EduGrid;
