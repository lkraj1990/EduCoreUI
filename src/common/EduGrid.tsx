import type { ReactNode } from 'react';
import { EduGridAction, EduGridProps } from './EduGridConstants';

const EduGrid = <T extends Record<string, unknown>>({ columns, data, onRowClick, actions }: EduGridProps<T>) => {

  if (!columns || !data) {
    return <div className="alert alert-warning">Invalid grid configuration</div>;
  }

  if (data.length === 0) {
    return <div className="alert alert-info">No data available</div>;
  }

  const renderActionContent = (action: EduGridAction<T>) => {
    if (action.renderIcon) {
      return action.renderIcon();
    }

    if (action.icon) {
      return <span aria-hidden="true">{action.icon}</span>;
    }

    return action.label;
  };

  const renderCellValue = (value: unknown): ReactNode => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value as unknown as ReactNode;
    }

    return String(value);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={column.sortable ? 'cursor-pointer' : ''}>
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
              const visibleActions = actions ? actions.filter((action) => (action.isVisible ? action.isVisible(row) : true)) : [];

              return (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td key={`${rowIndex}-${String(column.key)}`}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : column.type === 'badge'
                    ? <span className={`badge ${column.badgeClass || 'bg-success'}`}>
                        {renderCellValue(row[column.key])}
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
                        {renderCellValue(row[column.key])}
                      </a>
                    : renderCellValue(row[column.key])}
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
