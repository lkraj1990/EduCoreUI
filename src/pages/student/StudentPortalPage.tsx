const StudentPortalPage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Student Portal</h2>
      <p className="text-muted">Homework, attendance, results, fee status, and timetable for students.</p>
      <div className="row g-3">
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Attendance</h5><p className="text-muted mb-0">94% this month</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Upcoming Tests</h5><p className="text-muted mb-0">Math and Science</p></div></div></div>
      </div>
    </div>
  );
}

export default StudentPortalPage;
