import { feeRows } from '../../mockupData/mockupData';

const FeesPage = () => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="fw-bold mb-3">Fees Module</h2>
        <table className="table table-hover align-middle">
          <thead><tr><th>Student</th><th>Due</th><th>Paid</th><th>Balance</th></tr></thead>
          <tbody>{feeRows.map((row) => <tr key={row.student}><td>{row.student}</td><td>{row.due}</td><td>{row.paid}</td><td>{row.balance}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default FeesPage;
