import {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ShieldAlert,
  X,
} from "lucide-react";

const defaultChecks = [
  "Confirm the alert is active",
  "Check last successful communication",
  "Perform approved reachability check",
  "Check related alerts",
  "Check known maintenance activity",
];

const defaultActions = [
  "Validate the alert",
  "Perform initial checks",
  "Follow notification criteria",
  "Notify customer if required",
  "Escalate to L2 according to escalation matrix",
  "Update the incident",
  "Track until resolution",
];

function AlertProcedureModal({ alert, onClose }) {
  if (!alert) {
    return null;
  }

  const isCritical = alert.severityClass === "critical";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="procedure-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="procedure-modal-header">
          <div className="procedure-title-area">
            <div className={`procedure-severity-icon ${alert.severityClass}`}>
              <ShieldAlert size={21} />
            </div>

            <div>
              <span className="eyebrow">ALERT PROCEDURE</span>

              <h2>{alert.title}</h2>

              <span className={`procedure-severity ${alert.severityClass}`}>
                {alert.severity}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close procedure"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="procedure-modal-body">

          {/* What does it mean */}
          <section className="procedure-block">
            <div className="procedure-block-title">
              <FileText size={17} />
              <h3>What Does It Mean?</h3>
            </div>

            <p className="meaning-text">
              {alert.description}
            </p>
          </section>

          {/* Required Checks */}
          <section className="procedure-block">
            <div className="procedure-block-title">
              <ClipboardCheck size={17} />
              <h3>Required Checks</h3>
            </div>

            <div className="check-list">
              {defaultChecks.map((check, index) => (
                <label className="check-item" key={index}>
                  <input type="checkbox" />
                  <span>{check}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Required Actions */}
          <section className="procedure-block">
            <div className="procedure-block-title">
              <CheckCircle2 size={17} />
              <h3>Required Actions</h3>
            </div>

            <div className="action-list">
              {defaultActions.map((action, index) => (
                <div className="action-item" key={index}>
                  <span className="action-number">
                    {index + 1}
                  </span>

                  <span>{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section className="requirements-grid">

            <div className="requirement-card notification">
              <div className="requirement-icon">
                <Bell size={17} />
              </div>

              <div>
                <span>Customer Notification</span>

                <strong>
                  {alert.notification}
                </strong>
              </div>
            </div>

            <div
              className={`requirement-card ${
                isCritical ? "required" : "escalation"
              }`}
            >
              <div className="requirement-icon">
                <ShieldAlert size={17} />
              </div>

              <div>
                <span>L2 Escalation</span>

                <strong>
                  {alert.escalation}
                </strong>
              </div>
            </div>

          </section>
        </div>

        {/* Footer */}
        <div className="procedure-modal-footer">
          <button
            type="button"
            className="modal-action-button"
          >
            <Bell size={15} />
            EMAIL TEMPLATE
          </button>

          <button
            type="button"
            className="modal-action-button"
          >
            <ShieldAlert size={15} />
            L2 ESCALATION
          </button>

          <button
            type="button"
            className="modal-action-button"
          >
            <ClipboardCheck size={15} />
            CHECKLIST
          </button>

          <button
            type="button"
            className="modal-action-button primary"
          >
            <FileText size={15} />
            INCIDENT UPDATE
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertProcedureModal;