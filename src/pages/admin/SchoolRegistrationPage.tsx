import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EduGrid from '../../common/EduGrid';
import { schoolService, normalizeSchoolRequestRecord, type SchoolRequestRecord } from '../../services/schoolService';
import { getSchoolRegistrationStatus, schoolOnboardingService } from '../../services/schoolOnboardingService';

const SchoolRegistrationPage = () => {
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchoolRequests = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await schoolService.listSchoolRequests();
        const normalizedRows = Array.isArray(response)
          ? response.map((row) => {
            const normalizedRow = normalizeSchoolRequestRecord(row);
            const onboardingRecord = schoolOnboardingService.getBySchoolRequestId(normalizedRow.id);

            return {
              ...normalizedRow,
              status: getSchoolRegistrationStatus(onboardingRecord) || normalizedRow.status,
              paymentStatus: normalizedRow.paymentStatus || onboardingRecord?.paymentStatus || 'Pending',
            };
          })
          : [];
        setSchoolRequests(normalizedRows);
      } catch (requestError) {
        setError(requestError?.message || 'Failed to fetch school registration requests.');
      } finally {
        setLoading(false);
      }
    };

    loadSchoolRequests().catch(() => null);
  }, []);

  const columns = useMemo(() => ([
    {
      key: 'schoolName',
      label: 'School',
      render: (_value, row: SchoolRequestRecord) => (
        <Link
          to={`/school-registration/${row.id}`}
          className="text-primary text-decoration-none fw-semibold"
        >
          {row.schoolName || 'N/A'}
        </Link>
      ),
    },
    {
      key: 'adminName',
      label: 'Admin',
      render: (value) => value || 'N/A',
    },
    {
      key: 'planName',
      label: 'Plan',
      render: (value) => value || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusText = String(value || 'pending');
        const normalizedStatus = statusText.toLowerCase();
        const badgeClass = normalizedStatus === 'approved'
          ? 'bg-success'
          : normalizedStatus === 'payment complete'
          ? 'bg-info text-dark'
          : normalizedStatus === 'rejected'
          ? 'bg-danger'
          : normalizedStatus === 'payment failed'
          ? 'bg-danger'
          : 'bg-warning text-dark';

        return <span className={`badge ${badgeClass}`}>{statusText}</span>;
      },
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => {
        const paymentText = String(value || 'Pending');
        const normalizedStatus = paymentText.toLowerCase();
        const badgeClass = normalizedStatus === 'complete'
          ? 'bg-success'
          : normalizedStatus === 'failed'
          ? 'bg-danger'
          : normalizedStatus === 'pending'
          ? 'bg-warning text-dark'
          : 'bg-secondary';

        return <span className={`badge ${badgeClass}`}>{paymentText}</span>;
      },
    },
    {
      key: 'submittedAt',
      label: 'Submitted On',
      render: (value) => {
        if (!value) {
          return 'N/A';
        }

        const parsedDate = new Date(String(value));
        if (Number.isNaN(parsedDate.getTime())) {
          return String(value);
        }

        return parsedDate.toLocaleString();
      },
    },
  ]), []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="fw-bold mb-3">School Registration</h2>
        {loading ? <div className="text-muted">Loading school requests...</div> : null}
        {error ? <div className="alert alert-danger py-2">{error}</div> : null}
        {!loading && !error ? <EduGrid columns={columns} data={schoolRequests} /> : null}
      </div>
    </div>
  );
}

export default SchoolRegistrationPage;
