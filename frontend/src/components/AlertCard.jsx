import {
  ArrowRight,
  Bell,
  CircleAlert,
  CircleCheck,
  Flame,
  ShieldAlert,
  Trash2,
} from "lucide-react";

function AlertCard({ alert, onOpen, onDelete, deleting = false }) {
  const getSeverityIcon = () => {
    if (alert.severityClass === "critical") {
      return <ShieldAlert size={19} />;
    }

    if (alert.severityClass === "high") {
      return <Flame size={19} />;
    }

    if (alert.severityClass === "medium") {
      return <CircleAlert size={19} />;
    }

    return <CircleCheck size={19} />;
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${alert.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      onDelete(alert._id);
    }
  };

  return (
    <article className={`alert-card ${alert.severityClass}`}>
      <div className="alert-card-top">
        <div className="severity-icon">
          {getSeverityIcon()}
        </div>

        <span className="severity-badge">
          {alert.severity}
        </span>
      </div>

      <div className="alert-card-content">
        <h3>{alert.title}</h3>

        <p className="alert-description">
          {alert.description}
        </p>
      </div>

      <div className="alert-meta">
        <div className="meta-item">
          <div className="meta-label">
            <Bell size={13} />
            Customer Notification
          </div>

          <div className="meta-value">
            {alert.notification}
          </div>
        </div>

        <div className="meta-item">
          <div className="meta-label">
            <ShieldAlert size={13} />
            L2 Escalation
          </div>

          <div className="meta-value">
            {alert.escalation}
          </div>
        </div>
      </div>

      <div className="alert-card-actions">
        <button
          className="procedure-button"
          onClick={() => onOpen(alert)}
        >
          VIEW PROCEDURE
          <ArrowRight size={16} />
        </button>

        <button
          className="delete-alert-button"
          onClick={handleDelete}
          disabled={deleting}
          type="button"
        >
          <Trash2 size={16} />
          {deleting ? "DELETING..." : "DELETE"}
        </button>
      </div>
    </article>
  );
}

export default AlertCard;

