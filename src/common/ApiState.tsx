const ApiState = ({ loading, error, isEmpty, emptyMessage = 'No data available.', onRetry, children }) => {
  if (loading) {
    return <div className="alert alert-secondary mb-0">Loading...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0">
        <span>{error.message || 'Something went wrong while loading data.'}</span>
        {onRetry && (
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRetry()}>
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <div className="alert alert-info mb-0">{emptyMessage}</div>;
  }

  return children;
};

export default ApiState;
