const TeacherPortalPage = () => {
  return (
    <div className="card shadow-sm border-0 p-4">
      <h2 className="fw-bold mb-3">Teacher Portal</h2>
      <p className="text-muted">Attendance, homework, marks entry, timetable, and notices for teachers.</p>
      <div className="row g-3">
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Today’s Classes</h5><p className="text-muted mb-0">5 scheduled classes</p></div></div></div>
        <div className="col-md-6"><div className="card border-0 bg-light"><div className="card-body"><h5>Pending Tasks</h5><p className="text-muted mb-0">3 homework reviews</p></div></div></div>
      </div>
    </div>
  );
}

export default TeacherPortalPage;
