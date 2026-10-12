import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import axios from "axios";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ChartNoAxesColumn,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Mail,
  Phone,
  X,
  CheckCircle2,
  AlertCircle,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  ArrowUpRight,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type Student = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender: "Male" | "Female" | "Other";
  course: string;
  yearOfStudy: number;
  address?: string | null;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
};
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);
const blank: Omit<Student, "id"> = {
  studentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "Other",
  course: "BSc Software Engineering",
  yearOfStudy: 1,
  address: "",
  status: "Active",
};
const courses = [
  "BSc Software Engineering",
  "BSc Information Technology",
  "BSc Computer Science",
  "BSc Cyber Security",
  "BSc Data Science",
  "Higher Diploma in Computing",
];
const demoStudents: Student[] = [
  {
    id: 101,
    studentId: "STU003",
    firstName: "Ravindi",
    lastName: "Perera",
    email: "ravindi.student@example.com",
    phone: "0771234567",
    dateOfBirth: "2004-08-15",
    gender: "Female",
    course: "BSc Software Engineering",
    yearOfStudy: 2,
    address: "Maharagama, Colombo",
    status: "Active",
  },
  {
    id: 1,
    studentId: "STU001",
    firstName: "Amal",
    lastName: "Perera",
    email: "amal@example.com",
    phone: "0711111111",
    dateOfBirth: "2004-04-12",
    gender: "Male",
    course: "BSc Software Engineering",
    yearOfStudy: 2,
    address: "Colombo",
    status: "Active",
  },
  {
    id: 2,
    studentId: "STU002",
    firstName: "Sithmi",
    lastName: "Silva",
    email: "sithmi@example.com",
    phone: "0773333333",
    dateOfBirth: "2004-12-03",
    gender: "Female",
    course: "BSc Information Technology",
    yearOfStudy: 3,
    address: "Galle",
    status: "Active",
  },
];
type Notice = { type: "success" | "error"; text: string };
function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(blank);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [adminName, setAdminName] = useState("Ravindi S.");
  const [showAdmin, setShowAdmin] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Student[]>(`${API}/api/students`, {
        timeout: 5000,
      });
      setStudents(data);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      // Demo fallback keeps the UI usable before the database/API is configured.
      setStudents((current) => (current.length ? current : demoStudents));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        const text =
          `${s.studentId} ${s.firstName} ${s.lastName} ${s.email} ${s.course}`.toLowerCase();
        return (
          text.includes(search.toLowerCase()) &&
          (!courseFilter || s.course === courseFilter) &&
          (!yearFilter || String(s.yearOfStudy) === yearFilter)
        );
      }),
    [students, search, courseFilter, yearFilter],
  );
  const activeCount = students.filter((s) => s.status === "Active").length;
  const undergrad = students.filter((s) => s.yearOfStudy <= 4).length;
  const postgrad = students.filter((s) => s.yearOfStudy > 4).length;

  function startAdd() {
    setSelected(null);
    setForm({ ...blank });
    setModal("add");
  }
  function startEdit(s: Student) {
    setSelected(s);
    setForm({
      studentId: s.studentId,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phone: s.phone || "",
      dateOfBirth: s.dateOfBirth?.slice(0, 10) || "",
      gender: s.gender,
      course: s.course,
      yearOfStudy: s.yearOfStudy,
      address: s.address || "",
      status: s.status,
    });
    setModal("edit");
  }
  async function saveStudent(e: FormEvent) {
    e.preventDefault();
    if (
      !form.studentId.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.course.trim()
    ) {
      setNotice({
        type: "error",
        text: "Please complete all required fields.",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setNotice({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    try {
      if (apiOnline) {
        if (modal === "edit" && selected)
          await axios.put(`${API}/api/students/${selected.id}`, form);
        else await axios.post(`${API}/api/students`, form);
        await loadStudents();
      } else {
        if (modal === "edit" && selected)
          setStudents((prev) =>
            prev.map((s) => (s.id === selected.id ? { ...form, id: s.id } : s)),
          );
        else setStudents((prev) => [{ ...form, id: Date.now() }, ...prev]);
      }
      setModal(null);
      setNotice({
        type: "success",
        text:
          modal === "edit"
            ? "Student record updated successfully."
            : "Student added successfully.",
      });
    } catch (err: any) {
      setNotice({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Could not save the student. Check API/database connection.",
      });
    }
  }
  async function deleteStudent() {
    if (!deleteTarget) return;
    try {
      if (apiOnline)
        await axios.delete(`${API}/api/students/${deleteTarget.id}`);
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setNotice({ type: "success", text: "Student record deleted." });
    } catch (err: any) {
      setNotice({
        type: "error",
        text: err?.response?.data?.message || "Unable to delete student.",
      });
    }
    setDeleteTarget(null);
  }
  function exportCsv() {
    const rows = [
      [
        "Student ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Course",
        "Year",
        "Gender",
        "Status",
      ],
      ...filtered.map((s) => [
        s.studentId,
        s.firstName,
        s.lastName,
        s.email,
        s.phone || "",
        s.course,
        String(s.yearOfStudy),
        s.gender,
        s.status,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "studenthub-students.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice({ type: "success", text: "Student list exported to CSV." });
  }
  const initials = (s: Student) =>
    `${s.firstName[0] || ""}${s.lastName[0] || ""}`.toUpperCase();

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={23} />
          </div>
          <div>
            <b>StudentHub</b>
            <span>Management Portal</span>
          </div>
          <button
            className="mobile-close icon-button"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="nav-label">MAIN MENU</div>
        <button
          className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Dashboard");
            setSidebarOpen(false);
          }}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          className={`nav-item ${activePage === "Students" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Students");
            setSidebarOpen(false);
          }}
        >
          <Users size={18} />
          Students <span className="nav-count">{students.length}</span>
        </button>
        <button
          className={`nav-item ${activePage === "Courses" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Courses");
            setSidebarOpen(false);
          }}
        >
          <BookOpen size={18} />
          Courses
        </button>
        <button
          className={`nav-item ${activePage === "Reports" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Reports");
            setSidebarOpen(false);
          }}
        >
          <ChartNoAxesColumn size={18} />
          Reports
        </button>
        <div className="nav-label system-label">SYSTEM</div>
        <button
          className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Settings");
            setSidebarOpen(false);
          }}
        >
          <Settings size={18} />
          Settings
        </button>
        <div className="sidebar-spacer" />
        <div className="secure-card">
          <div className="secure-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <b>System {apiOnline ? "connected" : "ready"}</b>
            <span>
              {apiOnline ? "Database connected" : "Demo preview available"}
            </span>
          </div>
          <i className={apiOnline ? "online-dot" : "offline-dot"} />
        </div>
        <button
          className="profile-block"
          onClick={() => setShowAdmin((v) => !v)}
        >
          <div className="avatar admin-avatar">RS</div>
          <div className="profile-text">
            <b>{adminName}</b>
            <span>Administrator</span>
          </div>
          <ChevronDown size={16} />
        </button>
        {showAdmin && (
          <div className="admin-popover">
            <b>Administrator panel</b>
            <p>Manage the student directory and review system status.</p>
            <button
              onClick={() => {
                setShowAdmin(false);
                setActivePage("Settings");
              }}
            >
              <Settings size={14} /> Admin settings
            </button>
          </div>
        )}
        <div className="sidebar-foot">StudentHub © 2026</div>
      </aside>
      {sidebarOpen && (
        <div className="backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <main className="main">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-menu icon-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span className="crumb-slash">/</span>
            <b>{activePage}</b>
          </div>
          <div className="top-actions">
            <button
              className="top-icon icon-button"
              title="Notifications"
              onClick={() =>
                setNotice({ type: "success", text: "You are all caught up." })
              }
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-divider" />
            <button
              className="user-menu"
              onClick={() => setShowAdmin((v) => !v)}
            >
              <div className="avatar small-avatar">RS</div>
              <div>
                <b>{adminName}</b>
                <span>Admin</span>
              </div>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> ADMIN WORKSPACE
              </div>
              <h1>
                {activePage === "Dashboard"
                  ? "Student Management"
                  : activePage === "Students"
                    ? "Student Directory"
                    : activePage}
              </h1>
              <p>
                {activePage === "Dashboard"
                  ? "Manage student records, academic information and profiles from one place."
                  : activePage === "Students"
                    ? "Search, review and maintain student records."
                    : activePage === "Courses"
                      ? "Explore the courses currently used in student records."
                      : activePage === "Reports"
                        ? "Review enrollment figures and export student data."
                        : "Manage your administrator workspace."}
              </p>
            </div>
            <button className="primary-button" onClick={startAdd}>
              <Plus size={18} /> Add Student
            </button>
          </div>

          {activePage === "Dashboard" && (
            <section className="stats-grid">
              <Stat
                icon={<Users size={20} />}
                tone="blue"
                label="Total Students"
                value={students.length}
                hint="All registered students"
              />
              <Stat
                icon={<CheckCircle2 size={20} />}
                tone="green"
                label="Active Students"
                value={activeCount}
                hint="Currently registered"
              />
              <Stat
                icon={<GraduationCap size={20} />}
                tone="violet"
                label="Undergraduate"
                value={undergrad}
                hint="Years 1–4"
              />
              <Stat
                icon={<BookOpen size={20} />}
                tone="amber"
                label="Postgraduate"
                value={postgrad}
                hint="Year 5+"
              />
            </section>
          )}

          {(activePage === "Dashboard" ||
            activePage === "Students" ||
            activePage === "Reports") && (
            <section className="panel directory-panel">
              <div className="panel-head">
                <div>
                  <h2>
                    {activePage === "Reports"
                      ? "Student Report"
                      : "Student Directory"}
                  </h2>
                  <p>
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "student" : "students"} found{" "}
                    <span className="live-pill">
                      <i /> {apiOnline ? "Live data" : "Preview data"}
                    </span>
                  </p>
                </div>
                <div className="panel-actions">
                  <div className="search-box">
                    <Search size={17} />
                    <input
                      aria-label="Search students"
                      placeholder="Search students..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    className="secondary-button filter-trigger"
                    title="Refresh student data"
                    onClick={() => void loadStudents()}
                  >
                    <RefreshCw size={17} />
                  </button>
                  <button
                    className="secondary-button export-button"
                    onClick={exportCsv}
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="filter-row">
                <div className="filter-title">
                  <SlidersHorizontal size={15} /> Filters
                </div>
                <select
                  aria-label="Filter by course"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="">All courses</option>
                  {courses.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by year"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="">All study years</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
                <button
                  className="clear-filters"
                  onClick={() => {
                    setCourseFilter("");
                    setYearFilter("");
                    setSearch("");
                  }}
                >
                  Clear filters
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>STUDENT ID</th>
                      <th>COURSE</th>
                      <th>YEAR</th>
                      <th>CONTACT</th>
                      <th>STATUS</th>
                      <th className="actions-head">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={7}>
                          <div className="table-message">
                            <span className="spinner" /> Loading students…
                          </div>
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      filtered.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <div className="student-cell">
                              <div
                                className={`avatar student-avatar avatar-${s.id % 4}`}
                              >
                                {initials(s)}
                              </div>
                              <div className="student-name">
                                <b>
                                  {s.firstName} {s.lastName}
                                </b>
                                <span>
                                  {s.gender} ·{" "}
                                  {s.dateOfBirth
                                    ? new Date(
                                        `${s.dateOfBirth.slice(0, 10)}T00:00:00`,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Date of birth not set"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="student-id">{s.studentId}</span>
                          </td>
                          <td>
                            <div className="course-cell">
                              <b>{s.course}</b>
                              <span>
                                {s.yearOfStudy <= 4
                                  ? "Undergraduate"
                                  : "Postgraduate"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="year-badge">
                              Year {s.yearOfStudy}
                            </span>
                          </td>
                          <td>
                            <div className="contact-cell">
                              <span>
                                <Mail size={14} />
                                {s.email}
                              </span>
                              <span>
                                <Phone size={14} />
                                {s.phone || "Not provided"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${s.status === "Active" ? "status-active" : "status-inactive"}`}
                            >
                              <i />
                              {s.status}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button
                                title="View details"
                                onClick={() => {
                                  setSelected(s);
                                  setModal("view");
                                }}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                title="Edit student"
                                onClick={() => startEdit(s)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                title="Delete student"
                                className="danger-action"
                                onClick={() => setDeleteTarget(s)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {!loading && !filtered.length && (
                      <tr>
                        <td colSpan={7}>
                          <div className="empty-state">
                            <div>
                              <Users size={25} />
                            </div>
                            <b>No students found</b>
                            <span>
                              Try another search or add a new student.
                            </span>
                            <button
                              className="primary-button small-primary"
                              onClick={startAdd}
                            >
                              <Plus size={15} /> Add Student
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>
                  Showing <b>{filtered.length}</b> of <b>{students.length}</b>{" "}
                  students
                </span>
                <div className="pagination">
                  <button disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <span className="current-page">1</span>
                  <button disabled>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <span className="api-state">
                  <i className={apiOnline ? "online-dot" : "offline-dot"} />
                  {apiOnline ? "API connected" : "Demo mode"}
                </span>
              </div>
            </section>
          )}

          {activePage === "Courses" && (
            <section className="course-grid">
              {courses.map((c, i) => (
                <div className="course-card" key={c}>
                  <div className={`course-icon tone-${i % 4}`}>
                    <BookOpen size={22} />
                  </div>
                  <span className="course-code">
                    COURSE {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{c}</h3>
                  <p>
                    Students enrolled:{" "}
                    <b>{students.filter((s) => s.course === c).length}</b>
                  </p>
                  <button
                    onClick={() => {
                      setCourseFilter(c);
                      setActivePage("Students");
                    }}
                  >
                    View students <ArrowUpRight size={15} />
                  </button>
                </div>
              ))}
            </section>
          )}
          {activePage === "Settings" && (
            <section className="settings-grid">
              <div className="settings-card">
                <div className="settings-icon">
                  <ShieldCheck size={22} />
                </div>
                <h2>Administrator workspace</h2>
                <p>StudentHub administrator controls and application status.</p>
                <div className="setting-row">
                  <span>Backend API</span>
                  <b className={apiOnline ? "good-text" : "muted-text"}>
                    {apiOnline ? "Connected" : "Not connected"}
                  </b>
                </div>
                <div className="setting-row">
                  <span>Database mode</span>
                  <b>{apiOnline ? "Neon / PostgreSQL" : "Preview data"}</b>
                </div>
                <div className="setting-row">
                  <span>Students in directory</span>
                  <b>{students.length}</b>
                </div>
                <button
                  className="secondary-button wide-button"
                  onClick={() => void loadStudents()}
                >
                  <RefreshCw size={16} /> Recheck connection
                </button>
              </div>
              <div className="settings-card">
                <div className="settings-icon">
                  <UserRound size={22} />
                </div>
                <h2>Admin profile</h2>
                <p>Set the display name shown in the admin workspace.</p>
                <label className="field-label">
                  Display name
                  <input
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </label>
                <button
                  className="primary-button"
                  onClick={() =>
                    setNotice({
                      type: "success",
                      text: "Admin display name updated for this session.",
                    })
                  }
                >
                  Save profile
                </button>
                <p className="security-note">
                  <AlertCircle size={15} /> Demo profile only. This is not
                  server-side authentication.
                </p>
              </div>
            </section>
          )}
        </div>
        <footer className="app-footer">
          <span>
            © 2026 <b>StudentHub</b> · Student Management System
          </span>
          <span>Built for Full Stack Development · Task 2</span>
          <span className="footer-health">
            <i className={apiOnline ? "online-dot" : "offline-dot"} />
            {apiOnline ? "All systems operational" : "Preview available"}
          </span>
        </footer>
      </main>

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div
            className={`modal-card ${modal === "view" ? "view-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  {modal === "add"
                    ? "NEW RECORD"
                    : modal === "edit"
                      ? "UPDATE RECORD"
                      : "STUDENT PROFILE"}
                </span>
                <h2 id="modal-title">
                  {modal === "add"
                    ? "Add a student"
                    : modal === "edit"
                      ? "Edit student details"
                      : "Student details"}
                </h2>
                <p>
                  {modal === "view"
                    ? "Review the student's academic and contact information."
                    : "Enter accurate student information below."}
                </p>
              </div>
              <button
                className="icon-button modal-close"
                onClick={() => setModal(null)}
              >
                <X size={19} />
              </button>
            </div>
            {modal === "view" && selected ? (
              <>
                <div className="profile-hero">
                  <div className="avatar profile-avatar">
                    {initials(selected)}
                  </div>
                  <div>
                    <h3>
                      {selected.firstName} {selected.lastName}
                    </h3>
                    <span>{selected.studentId}</span>
                    <p>
                      <span
                        className={`status-badge ${selected.status === "Active" ? "status-active" : "status-inactive"}`}
                      >
                        <i />
                        {selected.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="details-grid">
                  <Detail label="Email address" value={selected.email} />
                  <Detail
                    label="Phone number"
                    value={selected.phone || "Not provided"}
                  />
                  <Detail label="Course" value={selected.course} />
                  <Detail
                    label="Year of study"
                    value={`Year ${selected.yearOfStudy}`}
                  />
                  <Detail
                    label="Date of birth"
                    value={
                      selected.dateOfBirth
                        ? selected.dateOfBirth.slice(0, 10)
                        : "Not provided"
                    }
                  />
                  <Detail label="Gender" value={selected.gender} />
                  <Detail
                    label="Address"
                    value={selected.address || "Not provided"}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="secondary-button"
                    onClick={() => setModal(null)}
                  >
                    Close
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => startEdit(selected)}
                  >
                    <Pencil size={16} /> Edit student
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={saveStudent}>
                <div className="form-grid">
                  <Field label="Student ID *">
                    <input
                      required
                      value={form.studentId}
                      onChange={(e) =>
                        setForm({ ...form, studentId: e.target.value })
                      }
                      placeholder="e.g. STU004"
                    />
                  </Field>
                  <Field label="Course *">
                    <select
                      required
                      value={form.course}
                      onChange={(e) =>
                        setForm({ ...form, course: e.target.value })
                      }
                    >
                      {courses.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="First name *">
                    <input
                      required
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </Field>
                  <Field label="Last name *">
                    <input
                      required
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </Field>
                  <Field label="Email address *">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="student@example.com"
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+94 77 123 4567"
                    />
                  </Field>
                  <Field label="Date of birth">
                    <input
                      type="date"
                      value={form.dateOfBirth || ""}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          gender: e.target.value as Student["gender"],
                        })
                      }
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="Year of study *">
                    <select
                      required
                      value={form.yearOfStudy}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          yearOfStudy: Number(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                        <option key={y} value={y}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as Student["status"],
                        })
                      }
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>
                  <Field label="Address" wide>
                    <input
                      value={form.address || ""}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="City, district"
                    />
                  </Field>
                </div>
                <div className="form-note">
                  <span>* Required fields</span>
                  <span>
                    <ShieldCheck size={14} /> Information is validated before
                    saving
                  </span>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle2 size={16} />
                    {modal === "edit" ? "Save changes" : "Create student"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="confirm-card">
            <div className="confirm-icon">
              <Trash2 size={23} />
            </div>
            <button
              className="icon-button confirm-close"
              onClick={() => setDeleteTarget(null)}
            >
              <X size={18} />
            </button>
            <h2>Delete student record?</h2>
            <p>
              Are you sure you want to remove{" "}
              <b>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </b>{" "}
              ({deleteTarget.studentId})? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => void deleteStudent()}
              >
                <Trash2 size={16} /> Delete record
              </button>
            </div>
          </div>
        </div>
      )}
      {notice && (
        <div className={`toast toast-${notice.type}`}>
          <div>
            {notice.type === "success" ? (
              <CheckCircle2 size={19} />
            ) : (
              <AlertCircle size={19} />
            )}
          </div>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
function Stat({
  icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  tone: string;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-hint">{hint}</div>
      <div className="stat-spark">
        <ArrowUpRight size={15} />
      </div>
    </div>
  );
}
function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`form-field ${wide ? "field-wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
export default App;
