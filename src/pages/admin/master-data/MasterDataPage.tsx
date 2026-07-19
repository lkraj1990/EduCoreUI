import { useMemo, useState } from 'react';
import EduGrid from '../../../common/EduGrid';
import EduModal from '../../../common/EduModal';
import type { EduGridAction, EduGridColumn, EduModalField } from '../../../common/EduGridConstants';

type TabKey = 'class' | 'section' | 'session' | 'subject' | 'room' | 'exam-master';
type ModalMode = 'add' | 'edit';
type RecordStatus = 'Active' | 'Inactive';

interface ClassRow {
  id: number;
  name: string;
  code: string;
  status: RecordStatus;
}

interface SectionRow {
  id: number;
  className: string;
  sectionName: string;
  room: string;
  status: RecordStatus;
}

interface SessionRow {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: RecordStatus;
}

interface SubjectRow {
  id: number;
  className: string;
  subjectName: string;
  subjectCode: string;
  status: RecordStatus;
}

interface RoomRow {
  id: number;
  roomName: string;
  block: string;
  capacity: number;
  status: RecordStatus;
}

interface ExamMasterRow {
  id: number;
  examName: string;
  examType: string;
  maxMarks: number;
  status: RecordStatus;
}

type MasterDataRow = ClassRow | SectionRow | SessionRow | SubjectRow | RoomRow | ExamMasterRow;

const editIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </svg>
);

const deleteIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const tabLabels: Record<TabKey, string> = {
  class: 'Class',
  section: 'Section',
  session: 'Session',
  subject: 'Subject',
  room: 'Room',
  'exam-master': 'ExamMaster',
};

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const renderStatusBadge = (value: unknown) => {
  const normalizedValue = String(value || '').toLowerCase();
  const badgeClass = normalizedValue === 'active' ? 'bg-success' : 'bg-danger';

  return <span className={`badge ${badgeClass}`}>{String(value || '')}</span>;
};

const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('class');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const [classes, setClasses] = useState<ClassRow[]>([
    { id: 1, name: 'Class 1', code: 'C1', status: 'Active' },
    { id: 2, name: 'Class 2', code: 'C2', status: 'Active' },
    { id: 3, name: 'Class 3', code: 'C3', status: 'Inactive' },
  ]);
  const [sections, setSections] = useState<SectionRow[]>([
    { id: 1, className: 'Class 1', sectionName: 'A', room: 'R-101', status: 'Active' },
    { id: 2, className: 'Class 1', sectionName: 'B', room: 'R-102', status: 'Active' },
    { id: 3, className: 'Class 2', sectionName: 'A', room: 'R-201', status: 'Inactive' },
  ]);
  const [sessions, setSessions] = useState<SessionRow[]>([
    { id: 1, title: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Active' },
    { id: 2, title: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Inactive' },
  ]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: 1, className: 'Class 1', subjectName: 'Mathematics', subjectCode: 'MATH-01', status: 'Active' },
    { id: 2, className: 'Class 2', subjectName: 'Science', subjectCode: 'SCI-02', status: 'Inactive' },
  ]);
  const [rooms, setRooms] = useState<RoomRow[]>([
    { id: 1, roomName: 'R-101', block: 'A', capacity: 40, status: 'Active' },
    { id: 2, roomName: 'LAB-1', block: 'B', capacity: 30, status: 'Inactive' },
  ]);
  const [examMasters, setExamMasters] = useState<ExamMasterRow[]>([
    { id: 1, examName: 'Unit Test 1', examType: 'Unit Test', maxMarks: 50, status: 'Active' },
    { id: 2, examName: 'Mid Term', examType: 'Term Exam', maxMarks: 100, status: 'Inactive' },
  ]);

  const classOptions = useMemo(() => classes.map((item) => item.name), [classes]);

  const activeData = useMemo(() => {
    switch (activeTab) {
      case 'class':
        return classes;
      case 'section':
        return sections;
      case 'session':
        return sessions;
      case 'subject':
        return subjects;
      case 'room':
        return rooms;
      case 'exam-master':
        return examMasters;
      default:
        return [];
    }
  }, [activeTab, classes, sections, sessions, subjects, rooms, examMasters]);

  const activeColumns = useMemo((): EduGridColumn<MasterDataRow>[] => {
    switch (activeTab) {
      case 'class':
        return [
          { key: 'name', label: 'Class' },
          { key: 'code', label: 'Code' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      case 'section':
        return [
          { key: 'className', label: 'Class' },
          { key: 'sectionName', label: 'Section' },
          { key: 'room', label: 'Room' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      case 'session':
        return [
          { key: 'title', label: 'Session' },
          { key: 'startDate', label: 'Start Date' },
          { key: 'endDate', label: 'End Date' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      case 'subject':
        return [
          { key: 'className', label: 'Class' },
          { key: 'subjectName', label: 'Subject' },
          { key: 'subjectCode', label: 'Code' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      case 'room':
        return [
          { key: 'roomName', label: 'Room' },
          { key: 'block', label: 'Block' },
          { key: 'capacity', label: 'Capacity' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      case 'exam-master':
        return [
          { key: 'examName', label: 'Exam Name' },
          { key: 'examType', label: 'Type' },
          { key: 'maxMarks', label: 'Max Marks' },
          { key: 'status', label: 'Status', render: (value) => renderStatusBadge(value) },
        ];
      default:
        return [];
    }
  }, [activeTab]);

  const activeFields = useMemo((): EduModalField[] => {
    switch (activeTab) {
      case 'class':
        return [
          { name: 'name', label: 'Class Name', type: 'text', required: true, placeholder: 'Example: Class 4' },
          { name: 'code', label: 'Class Code', type: 'text', required: true, placeholder: 'Example: C4' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      case 'section':
        return [
          {
            name: 'className',
            label: 'Class',
            type: 'select',
            required: true,
            options: classOptions.map((className) => ({ label: className, value: className })),
          },
          { name: 'sectionName', label: 'Section Name', type: 'text', required: true, placeholder: 'Example: A' },
          { name: 'room', label: 'Room', type: 'text', required: true, placeholder: 'Example: R-301' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      case 'session':
        return [
          { name: 'title', label: 'Session Title', type: 'text', required: true, placeholder: 'Example: 2027-2028' },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { name: 'endDate', label: 'End Date', type: 'date', required: true },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      case 'subject':
        return [
          {
            name: 'className',
            label: 'Class',
            type: 'select',
            required: true,
            options: classOptions.map((className) => ({ label: className, value: className })),
          },
          { name: 'subjectName', label: 'Subject Name', type: 'text', required: true, placeholder: 'Example: English' },
          { name: 'subjectCode', label: 'Subject Code', type: 'text', required: true, placeholder: 'Example: ENG-01' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      case 'room':
        return [
          { name: 'roomName', label: 'Room Name', type: 'text', required: true, placeholder: 'Example: R-401' },
          { name: 'block', label: 'Block', type: 'text', required: true, placeholder: 'Example: C' },
          { name: 'capacity', label: 'Capacity', type: 'number', required: true, placeholder: 'Example: 45' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      case 'exam-master':
        return [
          { name: 'examName', label: 'Exam Name', type: 'text', required: true, placeholder: 'Example: Final Term' },
          { name: 'examType', label: 'Exam Type', type: 'text', required: true, placeholder: 'Example: Term Exam' },
          { name: 'maxMarks', label: 'Max Marks', type: 'number', required: true, placeholder: 'Example: 100' },
          { name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions },
        ];
      default:
        return [];
    }
  }, [activeTab, classOptions]);

  const editingRow = useMemo(() => {
    return activeData.find((row) => row.id === editingRowId) || null;
  }, [activeData, editingRowId]);

  const openAddModal = () => {
    setModalMode('add');
    setEditingRowId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (row: MasterDataRow) => {
    setModalMode('edit');
    setEditingRowId(row.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRowId(null);
  };

  const deleteRow = (row: MasterDataRow) => {
    const recordLabel = (() => {
      switch (activeTab) {
        case 'class':
          return (row as ClassRow).name;
        case 'section':
          return `${(row as SectionRow).className} - ${(row as SectionRow).sectionName}`;
        case 'session':
          return (row as SessionRow).title;
        case 'subject':
          return (row as SubjectRow).subjectName;
        case 'room':
          return (row as RoomRow).roomName;
        case 'exam-master':
          return (row as ExamMasterRow).examName;
        default:
          return 'this record';
      }
    })();

    if (!window.confirm(`Are you sure to delete record ${recordLabel}?`)) {
      return;
    }

    switch (activeTab) {
      case 'class':
        setClasses((prev) => prev.filter((item) => item.id !== row.id));
        return;
      case 'section':
        setSections((prev) => prev.filter((item) => item.id !== row.id));
        return;
      case 'session':
        setSessions((prev) => prev.filter((item) => item.id !== row.id));
        return;
      case 'subject':
        setSubjects((prev) => prev.filter((item) => item.id !== row.id));
        return;
      case 'room':
        setRooms((prev) => prev.filter((item) => item.id !== row.id));
        return;
      case 'exam-master':
        setExamMasters((prev) => prev.filter((item) => item.id !== row.id));
        return;
      default:
        return;
    }
  };

  const handleModalSubmit = (formData: Record<string, unknown>) => {
    const targetId = modalMode === 'edit' && editingRowId ? editingRowId : Date.now();

    switch (activeTab) {
      case 'class': {
        const nextRow: ClassRow = {
          id: targetId,
          name: String(formData.name || '').trim(),
          code: String(formData.code || '').trim().toUpperCase(),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setClasses((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      case 'section': {
        const nextRow: SectionRow = {
          id: targetId,
          className: String(formData.className || '').trim(),
          sectionName: String(formData.sectionName || '').trim().toUpperCase(),
          room: String(formData.room || '').trim(),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setSections((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      case 'session': {
        const nextRow: SessionRow = {
          id: targetId,
          title: String(formData.title || '').trim(),
          startDate: String(formData.startDate || ''),
          endDate: String(formData.endDate || ''),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setSessions((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      case 'subject': {
        const nextRow: SubjectRow = {
          id: targetId,
          className: String(formData.className || '').trim(),
          subjectName: String(formData.subjectName || '').trim(),
          subjectCode: String(formData.subjectCode || '').trim().toUpperCase(),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setSubjects((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      case 'room': {
        const nextRow: RoomRow = {
          id: targetId,
          roomName: String(formData.roomName || '').trim().toUpperCase(),
          block: String(formData.block || '').trim().toUpperCase(),
          capacity: Number(formData.capacity || 0),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setRooms((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      case 'exam-master': {
        const nextRow: ExamMasterRow = {
          id: targetId,
          examName: String(formData.examName || '').trim(),
          examType: String(formData.examType || '').trim(),
          maxMarks: Number(formData.maxMarks || 0),
          status: (String(formData.status || 'Active') as RecordStatus),
        };
        setExamMasters((prev) => modalMode === 'edit'
          ? prev.map((item) => (item.id === targetId ? nextRow : item))
          : [...prev, nextRow]);
        break;
      }
      default:
        break;
    }

    closeModal();
  };

  const rowActions: EduGridAction<MasterDataRow>[] = [
    {
      label: 'Edit',
      tooltip: 'Edit',
      ariaLabel: 'Edit row',
      className: 'btn-outline-primary',
      iconOnly: true,
      renderIcon: () => editIcon,
      onClick: openEditModal,
    },
    {
      label: 'Delete',
      tooltip: 'Delete',
      ariaLabel: 'Delete row',
      className: 'btn-outline-danger',
      iconOnly: true,
      renderIcon: () => deleteIcon,
      onClick: deleteRow,
    },
  ];

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header page-card-header">
        <div className="page-header-wrap">
          <div>
            <h2 className="fw-bold mb-1">Master Data</h2>
            <p className="text-muted mb-0">Manage Class, Section, Session, Subject, Room, and ExamMaster in a single tabular form.</p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'class' ? 'active' : ''}`} onClick={() => setActiveTab('class')}>
              Class
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'section' ? 'active' : ''}`} onClick={() => setActiveTab('section')}>
              Section
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'session' ? 'active' : ''}`} onClick={() => setActiveTab('session')}>
              Session
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'subject' ? 'active' : ''}`} onClick={() => setActiveTab('subject')}>
              Subject
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'room' ? 'active' : ''}`} onClick={() => setActiveTab('room')}>
              Room
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={`nav-link ${activeTab === 'exam-master' ? 'active' : ''}`} onClick={() => setActiveTab('exam-master')}>
              ExamMaster
            </button>
          </li>
        </ul>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{tabLabels[activeTab]} Grid</h5>
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            Add {tabLabels[activeTab]}
          </button>
        </div>

        <EduGrid columns={activeColumns} data={activeData} actions={rowActions} />

        <EduModal
          title={`${modalMode === 'edit' ? 'Edit' : 'Add'} ${tabLabels[activeTab]}`}
          description={`Use this form to ${modalMode === 'edit' ? 'update' : 'add'} ${tabLabels[activeTab].toLowerCase()} details.`}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          fields={activeFields}
          initialValues={editingRow || {}}
          submitButtonText={modalMode === 'edit' ? 'Update' : 'Add'}
        />
      </div>
    </div>
  );
};

export default MasterDataPage;
