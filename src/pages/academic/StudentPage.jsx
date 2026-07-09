import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { openModal, closeModal, addStudent } from '../../redux/slices/studentSlice';
import EduGrid from '../../common/EduGrid';
import EduModal from '../../common/EduModal';

const StudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, showModal } = useSelector((state) => state.students);
  const [formData, setFormData] = useState({});

  // Define modal fields
  const modalFields = [
    {
      name: 'name',
      label: 'Student Name',
      type: 'text',
      placeholder: 'Enter student name',
      required: true,
    },
    {
      name: 'class',
      label: 'Class',
      type: 'select',
      required: true,
      options: [
        { value: 'Grade 1', label: 'Grade 1' },
        { value: 'Grade 2', label: 'Grade 2' },
        { value: 'Grade 3', label: 'Grade 3' },
        { value: 'Grade 4', label: 'Grade 4' },
        { value: 'Grade 5', label: 'Grade 5' },
        { value: 'Grade 6', label: 'Grade 6' },
        { value: 'Grade 7', label: 'Grade 7' },
        { value: 'Grade 8', label: 'Grade 8' },
        { value: 'Grade 9', label: 'Grade 9' },
        { value: 'Grade 10', label: 'Grade 10' },
        { value: 'Grade 11', label: 'Grade 11' },
        { value: 'Grade 12', label: 'Grade 12' },
      ],
    },
    {
      name: 'guardian',
      label: 'Guardian Name',
      type: 'text',
      placeholder: 'Enter guardian name',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Promoted', label: 'Promoted' },
      ],
    },
  ];

  // Define grid columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      type: 'link',
      onClick: (row) => navigate(`/student-profile/${encodeURIComponent(row.name)}`),
    },
    {
      key: 'class',
      label: 'Class',
    },
    {
      key: 'guardian',
      label: 'Guardian',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeClass: 'bg-success',
    },
  ];

  const handleModalSubmit = (data) => {
    dispatch(addStudent(data));
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Student Management</h2>
          <button className="btn btn-primary btn-sm" onClick={() => dispatch(openModal())}>
            Add Student
          </button>
        </div>

        {/* Use Dynamic Grid */}
        <EduGrid columns={columns} data={students} />
      </div>

      {/* Use Dynamic Modal */}
      <EduModal
        title="Add New Student"
        isOpen={showModal}
        onClose={() => dispatch(closeModal())}
        onSubmit={handleModalSubmit}
        fields={modalFields}
        submitButtonText="Add Student"
        cancelButtonText="Cancel"
      />
    </div>
  );
}

export default StudentPage;