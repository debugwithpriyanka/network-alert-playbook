import { useState } from "react";
import { X, Plus } from "lucide-react";

function AddAlertModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "CRITICAL",
    notification: "",
    escalation: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description) {
      return;
    }

    try {
      setSubmitting(true);

      await onCreate(formData);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="add-alert-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">ALERT MANAGEMENT</span>
            <h2>Add New Alert</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Alert Name</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. HIGH TEMPERATURE"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this alert means..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Severity</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
              <option value="INFORMATIONAL">
                🔵 Informational
              </option>
            </select>

            <span className="field-hint">
              Alert color will be assigned automatically based on severity.
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Notification</label>

              <select
                name="notification"
                value={formData.notification}
                onChange={handleChange}
              >
                <option value="">Select option</option>
                <option value="REQUIRED">Required</option>
                <option value="Based on approved criteria">
                  Based on approved criteria
                </option>
                <option value="Not Required">Not Required</option>
              </select>
            </div>

            <div className="form-group">
              <label>L2 Escalation</label>

              <select
                name="escalation"
                value={formData.escalation}
                onChange={handleChange}
              >
                <option value="">Select option</option>
                <option value="REQUIRED">Required</option>
                <option value="If required">If required</option>
                <option value="If persistent">If persistent</option>
                <option value="Not Required">Not Required</option>
              </select>
            </div>
          </div>

          <div className="severity-preview">
            <span className={`preview-dot ${formData.severity.toLowerCase()}`} />

            <div>
              <strong>{formData.severity}</strong>
              <span>
                The system will automatically apply the matching alert
                styling.
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              <Plus size={16} />

              {submitting ? "ADDING..." : "ADD ALERT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAlertModal;