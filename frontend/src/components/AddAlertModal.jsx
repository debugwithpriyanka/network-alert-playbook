import { useState } from "react";

function AddAlertModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    notification: "",
    escalation: "",
    checks: "",
    actions: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const alertData = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        notification: formData.notification,
        escalation: formData.escalation,

        checks: formData.checks
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        actions: formData.actions
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await onCreate(alertData);

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create alert.");
    } finally {
      setSaving(false);
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
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Alert Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. HIGH TEMPERATURE"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the alert..."
              required
            />
          </label>

          <label>
            Severity
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
              <option value="INFORMATIONAL">
                INFORMATIONAL
              </option>
            </select>
          </label>

          <label>
            Customer Notification
            <input
              name="notification"
              value={formData.notification}
              onChange={handleChange}
              placeholder="e.g. REQUIRED"
            />
          </label>

          <label>
            Escalation
            <input
              name="escalation"
              value={formData.escalation}
              onChange={handleChange}
              placeholder="e.g. REQUIRED"
            />
          </label>

          <label>
            Checks
            <textarea
              name="checks"
              value={formData.checks}
              onChange={handleChange}
              placeholder="One check per line"
            />
          </label>

          <label>
            Actions
            <textarea
              name="actions"
              value={formData.actions}
              onChange={handleChange}
              placeholder="One action per line"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="save-alert-button"
              disabled={saving}
            >
              {saving ? "SAVING..." : "CREATE ALERT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAlertModal;