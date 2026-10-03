import {
  Activity,
  BellRing,
  BookOpen,
  FileText,
  GitBranch,
  LayoutDashboard,
} from "lucide-react";

function Header() {
  return (
    <>
      <header className="top-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Activity size={22} />
          </div>

          <div>
            <h1>NETWORK ALERT PLAYBOOK</h1>
            <p>Alert Handling • Notification • Escalation • Resolution</p>
          </div>
        </div>

        <div className="operator-status">
          <span className="status-dot"></span>
          NOC OPERATIONS
        </div>
      </header>

      <nav className="navigation">
        <button className="nav-item">
          <LayoutDashboard size={16} />
          Dashboard
        </button>

        <button className="nav-item active">
          <BellRing size={16} />
          Alert Playbook
        </button>

        <button className="nav-item">
          <FileText size={16} />
          Notification Templates
        </button>

        <button className="nav-item">
          <GitBranch size={16} />
          Escalation Matrix
        </button>

        <button className="nav-item">
          <BookOpen size={16} />
          SOP
        </button>
      </nav>
    </>
  );
}

export default Header;