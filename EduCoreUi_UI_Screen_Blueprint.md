# EduCoreUi – School ERP UI Screen Blueprint

## 1. Project Vision
EduCoreUi is a multi-tenant SaaS School ERP frontend built with React, Bootstrap, Redux Toolkit, and React Query. The UI should support:
- Super Admin SaaS portal
- School-level admin operations
- Parent/Student/Teacher mobile-friendly workflows
- White-label branding per tenant
- Modular role-based access

---

## 2. Recommended App Structure

### Main Layouts
- Public Layout
  - Login
  - Register School
  - Forgot Password
  - Reset Password
  - Pricing / Plans
- Super Admin Layout
  - SaaS Portal dashboard and tenant management
- School Admin Layout
  - School dashboard and all academic/finance modules
- Portal Layouts for Parent / Student / Teacher
  - Limited role-based dashboards and workflows

---

## 3. Suggested Routes / Screens

### A. Authentication & Public Pages
1. Login
2. Register School / Tenant Signup
3. Forgot Password
4. Reset Password
5. OTP Verification
6. Two-Factor Authentication Setup
7. Choose Plan / Trial Signup
8. Email Verification
9. Tenant Domain Setup
10. Onboarding Wizard

### B. Super Admin (SaaS Portal)
1. Super Admin Dashboard
   - Statistics cards
   - Active tenants
   - Revenue overview
   - Trial users
   - Support tickets
2. Tenant Management
   - Tenant List
   - Add Tenant
   - Edit Tenant
   - Tenant Details
   - Tenant Status Toggle
3. School Registration
   - New School Registration Form
   - Review Pending Schools
   - Approve / Reject School
4. Subscription Plans
   - Plan List
   - Add/Edit Plan
   - Feature-based pricing view
5. Billing & Invoices
   - Billing Overview
   - Invoice List
   - Invoice Detail
   - Payment History
6. Storage Management
   - Storage Usage Dashboard
   - Storage Limits by Tenant
7. Domain Mapping
   - Subdomain Mapping
   - Custom Domain Setup
8. White Label Settings
   - Branding Configurator
   - Logo/Favicon/Theme Editor
9. Global Notifications
   - Broadcast Notification Form
   - Notification History
10. Global Reports
   - SaaS-level reports
11. Support Ticket Center
   - Ticket List
   - Ticket Detail
   - Reply Ticket
12. Audit Logs
   - User Activity Logs
   - Login History
   - Security Events

### C. School Admin / Institution Module
1. School Dashboard
   - KPI cards
   - Today’s attendance
   - Fee collection summary
   - Exam schedule
   - Announcements
2. Academic Management
   - Classes / Sections
   - Subjects
   - Academic Sessions
   - Syllabus Planner
3. Student Management
   - Student List
   - Add Student
   - Student Profile
   - Student Transfer / Promotion
4. Parent Management
   - Parent List
   - Parent Profile
   - Link Parent to Student
5. Staff Management
   - Staff List
   - Add Staff
   - Staff Profile
   - Assign Roles / Departments
6. Attendance Module
   - Daily Attendance Marking
   - Attendance Report
   - Absentee List
7. Fees Module
   - Fee Structure
   - Fee Collection
   - Pending Fees
   - Fee Receipt
   - Fee Report
8. Exams Module
   - Exam List
   - Add Exam
   - Marks Entry
   - Result Publication
   - Marksheet View
9. Homework Module
   - Assign Homework
   - Homework List
   - Student Homework Submission
10. Timetable Module
   - Class Timetable
   - Teacher Timetable
   - Edit Timetable
11. Online Class Module
   - Create Online Class
   - Class Schedule
   - Google Meet Integration View
12. PTM Module
   - PTM Schedule
   - Meeting Booking / Notes
13. Leave Module
   - Leave Requests
   - Approval Workflow
14. Payroll Module
   - Salary Structure
   - Payslip Generation
   - Salary Report
15. Library Module
   - Book List
   - Issue / Return Books
16. Transport Module
   - Vehicle Management
   - Route Management
   - Student Transport Assignment
17. Hostel Module (Optional)
   - Room Allocation
   - Hostel Fees
18. Inventory Module
   - Item Stock
   - Purchase / Issue Records
19. Communication Center
   - SMS / Email / WhatsApp Campaigns
   - Notification Templates
20. Certificates & Documents
   - Certificate List
   - Generate Certificate
   - Document Upload Center
21. LMS Module
   - Course List
   - Content Upload
   - Assignment / Quiz Management
22. Reports Center
   - Admission Report
   - Attendance Report
   - Fee Report
   - Salary Report
   - Exam Report
   - Inventory Report
   - Custom Report Builder

### D. Role-Based User Portals

#### Teacher Portal
1. Teacher Dashboard
2. Attendance Marking
3. Homework Management
4. Marks Entry
5. Timetable View
6. Leave Request
7. Notice Board
8. Online Class Schedule

#### Student Portal
1. Student Dashboard
2. Attendance View
3. Homework List
4. Fee Status
5. Result View
6. Timetable
7. Notice Board
8. Lecture Recordings

#### Parent Portal
1. Parent Dashboard
2. Child Attendance
3. Homework View
4. Fee Payment Status
5. Exam Results
6. Teacher Messages / PTM
7. Notifications

### E. Settings & Configuration
1. Tenant Configuration
   - School Info
   - Theme & Branding
   - Time Zone / Currency / Language
   - SMTP / SMS / WhatsApp Config
   - Payment Gateway Config
   - Storage Settings
2. Role & Permission Management
   - Role List
   - Add/Edit Role
   - Assign Permissions
   - Custom Role Builder
3. User Management
   - Users List
   - Add User
   - Reset Password
   - Login Device Management
4. Backup & Restore Settings
5. Security Settings
   - Password Policy
   - 2FA Configuration

---

## 4. Recommended UI Components
Use reusable Bootstrap-based components:
- AppShell / Sidebar Layout
- Top Navbar
- Page Header with actions
- Stat Cards
- Data Tables with filters and pagination
- Modal Forms
- Tabs and Wizards
- Charts (revenue, attendance, fees)
- File Uploaders
- Calendar Views
- Notification Center UI
- Role-Permission Tree View

---

## 5. Suggested Redux Toolkit Slices
- authSlice
- tenantSlice
- userSlice
- rolePermissionSlice
- billingSlice
- schoolDashboardSlice
- studentSlice
- staffSlice
- feeSlice
- attendanceSlice
- examSlice
- homeworkSlice
- notificationSlice
- reportSlice

---

## 6. Suggested React Query Usage
- auth queries and mutations
- tenant details and settings
- school dashboard statistics
- paginated lists for students, staff, fees, exams
- real-time updates via polling or WebSocket integration

---

## 7. Suggested Folder Structure
src/
  api/
  app/
    store.js
    routes.js
  components/
    common/
    layout/
    tables/
    forms/
    charts/
  features/
    auth/
    super-admin/
    school-admin/
    students/
    staff/
    fees/
    attendance/
    exams/
    homework/
    reports/
    settings/
  pages/
    public/
    super-admin/
    school-admin/
    teacher/
    student/
    parent/
  hooks/
  utils/
  styles/

---

## 8. Recommended First Phase Screens
If you want to build MVP quickly, start with these screens:
1. Login
2. Super Admin Dashboard
3. Tenant Management
4. School Registration
5. School Admin Dashboard
6. Student Management
7. Staff Management
8. Attendance
9. Fees
10. Exams
11. Reports
12. Role & Permission Management

---

## 9. UI Design Direction
- Clean modern dashboard UI
- Bootstrap 5 cards, tables, forms, and modals
- Sidebar navigation per role
- Light/dark theme support
- Tenant branding from configuration
- Mobile-friendly responsive experience

---

## 10. Suggested MVP Scope for EduCoreUi
For version 1, focus on:
- Authentication
- Tenant onboarding
- School admin dashboard
- Student, staff, fee, attendance, exam modules
- Reports
- Role-based access

This is enough to deliver a strong initial SaaS school ERP product.
