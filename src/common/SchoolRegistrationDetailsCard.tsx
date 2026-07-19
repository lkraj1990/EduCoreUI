import { useRef, type ReactNode, type Ref } from 'react';
import {
  getSchoolRegistrationStatus,
  normalizeSchoolPaymentStatus,
  type SchoolOnboardingRecord,
} from '../services/schoolOnboardingService';
import { type SchoolRequestRecord } from '../services/schoolService';

type SchoolRegistrationDetailsCardProps = {
  school: SchoolRequestRecord;
  onboardingRecord?: Partial<SchoolOnboardingRecord> | null;
  title: string;
  subtitle?: string;
  statusLabel?: string;
  topAlert?: ReactNode;
  footer?: ReactNode;
  headerActions?: ReactNode;
  showPrintButton?: boolean;
  detailsRef?: Ref<HTMLDivElement>;
};

const toDateLabel = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString();
};

const toPaymentLabel = (status?: string) => {
  const normalizedStatus = normalizeSchoolPaymentStatus(status);

  if (normalizedStatus === 'complete') {
    return 'Complete';
  }

  if (normalizedStatus === 'failed') {
    return 'Failed';
  }

  return 'Initiated';
};

const SchoolRegistrationDetailsCard = ({
  school,
  onboardingRecord,
  title,
  subtitle,
  statusLabel,
  topAlert,
  footer,
  headerActions,
  showPrintButton = true,
  detailsRef,
}: SchoolRegistrationDetailsCardProps) => {
  const printableContentRef = useRef<HTMLDivElement | null>(null);
  const effectivePaymentStatus = normalizeSchoolPaymentStatus(onboardingRecord?.paymentStatus || school.paymentStatus);
  const effectiveStatusLabel = statusLabel || getSchoolRegistrationStatus({
    ...onboardingRecord,
    paymentStatus: effectivePaymentStatus,
  });

  const paymentReference = onboardingRecord?.paymentReference || school.paymentReference || 'Pending';
  const paymentFailureReason = onboardingRecord?.paymentFailedReason || school.paymentFailureReason || 'N/A';

  const handlePrintDetails = () => {
    const printableContent = printableContentRef.current?.innerHTML;

    if (!printableContent) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      return;
    }

    const printedAt = new Date().toLocaleString();

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Registration Slip</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
            }

            .print-sheet {
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 20px;
            }

            .print-header {
              margin-bottom: 16px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 10px;
            }

            .print-header h1 {
              margin: 0;
              font-size: 24px;
            }

            .print-meta {
              margin-top: 6px;
              font-size: 13px;
              color: #475569;
            }

            .row {
              display: flex;
              flex-wrap: wrap;
              margin-left: -8px;
              margin-right: -8px;
            }

            .col-md-6 {
              width: 50%;
              box-sizing: border-box;
              padding-left: 8px;
              padding-right: 8px;
              margin-bottom: 8px;
            }

            p {
              margin: 0;
              line-height: 1.5;
            }

            strong {
              font-weight: 700;
            }

            @media print {
              body {
                padding: 0;
              }

              .print-sheet {
                border: none;
                border-radius: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-sheet">
            <div class="print-header">
              <h1>Registration Slip</h1>
              <div class="print-meta"><strong>Date & Time:</strong> ${printedAt}</div>
            </div>
            <div>${printableContent}</div>
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div ref={detailsRef} className="card shadow-sm border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h2 className="fw-bold mb-1">{title}</h2>
            {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
          </div>
          {showPrintButton || headerActions ? (
            <div className="d-flex flex-wrap gap-2">
              {showPrintButton ? (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={handlePrintDetails}>
                  Print
                </button>
              ) : null}
              {headerActions}
            </div>
          ) : null}
        </div>

        <div ref={printableContentRef}>
          {topAlert}

          <div className="row g-3">
            <div className="col-md-6"><p className="mb-1"><strong>School:</strong> {school.schoolName || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Registration ID:</strong> {school.id || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Admin Name:</strong> {school.adminName || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Admin Email:</strong> {school.adminEmail || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Admin Mobile:</strong> {school.adminMobile || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Plan:</strong> {school.planName || school.planId || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Status:</strong> {effectiveStatusLabel || 'Requested'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Status:</strong> {toPaymentLabel(onboardingRecord?.paymentStatus || school.paymentStatus)}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Location:</strong> {school.location || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Submitted On:</strong> {toDateLabel(school.submittedAt)}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Reviewed By:</strong> {onboardingRecord?.reviewedBy || school.reviewedBy || 'N/A'}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Reviewed On:</strong> {toDateLabel(onboardingRecord?.reviewedAt || school.reviewedAt)}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Reference:</strong> {paymentReference}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Failure Reason:</strong> {paymentFailureReason}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Started At:</strong> {toDateLabel(onboardingRecord?.paymentStartedAt || school.paymentStartedAt)}</p></div>
            <div className="col-md-6"><p className="mb-1"><strong>Payment Completed At:</strong> {toDateLabel(onboardingRecord?.paymentCompletedAt || school.paymentCompletedAt)}</p></div>
          </div>
        </div>

        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
};

export default SchoolRegistrationDetailsCard;
