
import { useEffect, useState } from "react";
import { getAlertActivity } from "../services/api";

function AlertActivity({ alertId, onClose }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAlertActivity(alertId);

        if (!cancelled) {
          setActivities(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load activity history");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [alertId]);

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h2>Activity History</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      {loading && <p>Loading activity...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && activities.length === 0 && (
        <p>No activity recorded yet.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <ul className="activity-list">
          {activities.map((activity) => (
            <li key={activity._id}>
              <strong>{activity.action}</strong>
              <p>{activity.description}</p>
              <small>
                {activity.createdAt
                  ? new Date(activity.createdAt).toLocaleString()
                  : ""}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertActivity;