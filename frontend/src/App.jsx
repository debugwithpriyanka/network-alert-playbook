import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Plus } from "lucide-react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AlertCard from "./components/AlertCard";
import AlertProcedureModal from "./components/AlertProcedureModal";
import AddAlertModal from "./components/AddAlertModal";
import AlertActivity from "./components/AlertActivity";

import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getActivitySummary,
  getRecentActivity,
} from "./services/api";

  
function AlertSummary({
  alerts,
  activitySummary,
  activitySummaryError,
  recentActivities,
  recentActivityError,
}) {
  const [activitySummaryOpen, setActivitySummaryOpen] = useState(true);
  const [recentActivityOpen, setRecentActivityOpen] = useState(true);

  const activeAlerts = alerts.filter(
    (alert) => alert.active !== false
  );

  const severities = [
    { label: "Critical", color: "#ff6262" },
    { label: "High", color: "#ffad4d" },
    { label: "Medium", color: "#f3d36a" },
    { label: "Low", color: "#35d6a0" },
    { label: "Informational", color: "#65a9ff" },
  ];

  const severityCounts = severities.map((severity) => ({
    ...severity,
    count: activeAlerts.filter(
      (alert) =>
        alert.severity?.toUpperCase() ===
        severity.label.toUpperCase()
    ).length,
  }));

  const notificationRequired = activeAlerts.filter(
    (alert) =>
      (alert.notification || "").toLowerCase().includes("required")
  ).length;

  const criticalCount = severityCounts.find(
    (item) => item.label === "Critical"
  ).count;

  const highCount = severityCounts.find(
    (item) => item.label === "High"
  ).count;

  return (
    <section className="security-overview">
      {/* Security Overview heading */}
      <div className="overview-heading">
        <div>
          <span className="eyebrow">SECURITY MONITORING</span>
          <h2>Security Overview</h2>
          <p>
            Alert status, severity distribution and
            notification requirements.
          </p>
        </div>

        <span className="overview-live-label">
          {activeAlerts.length} Active
        </span>
      </div>

      {/* Overview statistics */}
      <div className="overview-stat-grid">
        <div className="summary-card summary-active">
          <span>Active Alerts</span>
          <strong>
            {String(activeAlerts.length).padStart(2, "0")}
          </strong>
          <p>Currently active</p>
        </div>

        <div className="summary-card summary-critical">
          <span>Critical Alerts</span>
          <strong>{String(criticalCount).padStart(2, "0")}</strong>
          <p>Highest severity</p>
        </div>

        <div className="summary-card summary-high">
          <span>High Alerts</span>
          <strong>{String(highCount).padStart(2, "0")}</strong>
          <p>High priority</p>
        </div>

        <div className="summary-card summary-total">
          <span>Total Procedures</span>
          <strong>{String(alerts.length).padStart(2, "0")}</strong>
          <p>Loaded procedures</p>
        </div>
      </div>

      {/* Severity and notification details */}
      <div className="overview-detail-grid">
        <div className="overview-panel">
          <div className="overview-panel-heading">
            <h3>Severity Breakdown</h3>
            <span>Active alerts</span>
          </div>

          {severityCounts.map((severity) => {
            const percentage =
              activeAlerts.length === 0
                ? 0
                : (severity.count / activeAlerts.length) * 100;

            return (
              <div className="severity-row" key={severity.label}>
                <div className="severity-label-row">
                  <span>
                    <i
                      className="severity-dot"
                      style={{ backgroundColor: severity.color }}
                    />
                    {severity.label}
                  </span>

                  <strong>{severity.count}</strong>
                </div>

                <div className="severity-track">
                  <div
                    className="severity-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: severity.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overview-panel">
          <div className="overview-panel-heading">
            <h3>Notification Configuration</h3>
            <span>Active alerts</span>
          </div>

          <div className="notification-total">
            <strong>{notificationRequired}</strong>
            <span>Alerts marked as requiring notification</span>
          </div>

          <div className="notification-track">
            <div
              className="notification-fill"
              style={{
                width: `${
                  activeAlerts.length === 0
                    ? 0
                    : (notificationRequired / activeAlerts.length) * 100
                }%`,
              }}
            />
          </div>

          <p className="overview-note">
            Based on each alert's saved notification text.
            This does not indicate whether a notification was sent.
          </p>
        </div>
      </div>

      {/* Collapsible activity panels */}
      <div className="activity-panels-grid">
        {/* Activity Summary */}
        <section className="activity-summary-section">
          <button
            type="button"
            className="activity-section-heading activity-section-toggle"
            onClick={() =>
              setActivitySummaryOpen((open) => !open)
            }
            aria-expanded={activitySummaryOpen}
            aria-controls="activity-summary-content"
          >
            <h3>Activity Summary</h3>
            <span
              className={
                activitySummaryOpen
                  ? "activity-arrow open"
                  : "activity-arrow"
              }
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          {activitySummaryOpen && (
            <div id="activity-summary-content">
              {activitySummaryError ? (
                <p className="error-message">
                  {activitySummaryError}
                </p>
              ) : (
                <div className="activity-summary-grid">
                  <div className="activity-stat-card activity-created">
                    <span>Created</span>
                    <strong>{activitySummary.created}</strong>
                  </div>

                  <div className="activity-stat-card activity-updated">
                    <span>Updated</span>
                    <strong>{activitySummary.updated}</strong>
                  </div>

                  <div className="activity-stat-card activity-deleted">
                    <span>Deleted</span>
                    <strong>{activitySummary.deleted}</strong>
                  </div>

                  <div className="activity-stat-card activity-total">
                    <span>Total Records</span>
                    <strong>{activitySummary.total}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="recent-activity-section">
          <button
            type="button"
            className="activity-section-heading activity-section-toggle"
            onClick={() =>
              setRecentActivityOpen((open) => !open)
            }
            aria-expanded={recentActivityOpen}
            aria-controls="recent-activity-content"
          >
            <h3>Recent Activity</h3>
            <span
              className={
                recentActivityOpen
                  ? "activity-arrow open"
                  : "activity-arrow"
              }
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          {recentActivityOpen && (
            <div id="recent-activity-content">
              {recentActivityError ? (
                <p className="error-message">
                  {recentActivityError}
                </p>
              ) : recentActivities.length === 0 ? (
                <p className="activity-empty-state">
                  No recent activity records found.
                </p>
              ) : (
                <div className="recent-activity-list">
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div
                      className="recent-activity-item"
                      key={activity._id}
                    >
                      <div className="recent-activity-details">
                        <strong>
                          {(activity.action || "ACTIVITY").toUpperCase()}
                        </strong>

                        <p>
                          {activity.description ||
                            `Alert "${
                              activity.alertTitle || "Unknown alert"
                            }" activity recorded.`}
                        </p>

                        <span>
                          {activity.createdAt
                            ? new Date(
                                activity.createdAt
                              ).toLocaleString()
                            : "Time unavailable"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}


function App() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState(null);

  const [historyAlert, setHistoryAlert] = useState(null);

  const [activitySummary, setActivitySummary] = useState({
    created: 0,
    updated: 0,
    deleted: 0,
    total: 0,
  });

  const [activitySummaryError, setActivitySummaryError] =
    useState("");

  const [recentActivities, setRecentActivities] = useState([]);
  const [recentActivityError, setRecentActivityError] = useState("");

  const [deletingAlertId, setDeletingAlertId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadActivitySummary = async () => {
   try {
     const summary = await getActivitySummary();

      setActivitySummary({
        created: summary.created ?? 0,
        updated: summary.updated ?? 0,
        deleted: summary.deleted ?? 0,
        total: summary.total ?? 0,
      });

      setActivitySummaryError("");
    } catch (error) {
        console.error("Failed to load activity summary:", error);
        setActivitySummaryError("Unable to load activity totals.");
      }
  };

  const loadRecentActivity = async () => {
  try {
    const activities = await getRecentActivity();
    setRecentActivities(activities);
    setRecentActivityError("");
  } catch (error) {
    console.error("Failed to load recent activity:", error);
    setRecentActivityError("Unable to load recent activity.");
  }
};

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        const data = await getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load alert procedures.");
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
    loadActivitySummary();
    loadRecentActivity();
  }, []);

  // Create a new alert
  const handleCreateAlert = async (alertData) => {
    const newAlert = await createAlert(alertData);

    setAlerts((previousAlerts) => [
      newAlert,
      ...previousAlerts,
    ]);

    setShowAddAlert(false);
  };

  // Update an existing alert
const handleUpdateAlert = async (id, alertData) => {
  const updatedAlert = await updateAlert(id, alertData);

  setAlerts((previousAlerts) =>
    previousAlerts.map((alert) =>
      alert._id === id ? updatedAlert : alert
    )
  );

  setAlertToEdit(null);
};

  // Delete an alert permanently
  const handleDeleteAlert = async (id) => {
    try {
      setDeletingAlertId(id);
      setDeleteError("");

      await deleteAlert(id);

      setAlerts((previousAlerts) =>
        previousAlerts.filter((alert) => alert._id !== id)
      );

      if (selectedAlert?._id === id) {
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error("Delete alert error:", error);
      setDeleteError(error.message || "Failed to delete alert.");
    } finally {
      setDeletingAlertId(null);
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        (alert.title || "").toLowerCase().includes(searchText) ||
        (alert.description || "").toLowerCase().includes(searchText);

      let matchesFilter = true;

      if (
        selectedFilter === "Critical" ||
        selectedFilter === "High" ||
        selectedFilter === "Medium" ||
        selectedFilter === "Low"
      ) {
        matchesFilter =
          (alert.severity || "").toUpperCase() ===
          selectedFilter.toUpperCase();
      }

      if (selectedFilter === "Customer Notification Required") {
        matchesFilter = (alert.notification || "")
          .toLowerCase()
          .includes("required");
      }

      return matchesSearch && matchesFilter;
    });
  }, [alerts, search, selectedFilter]);

  return (
    <div className="app">
      <Header />

      <main className="dashboard">
        {selectedAlert && (
          <AlertProcedureModal
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
          />
        )}

        {historyAlert && (
          <AlertActivity
            key={historyAlert._id}
            alertId={historyAlert._id}
            onClose={() => setHistoryAlert(null)}
         />
       )}

        {(showAddAlert || alertToEdit) && (
          <AddAlertModal
            key={alertToEdit?._id || "new-alert"}
            alert={alertToEdit}
            onClose={() => {
            setShowAddAlert(false);
            setAlertToEdit(null);
        }}
            onCreate={handleCreateAlert}
            onUpdate={handleUpdateAlert}
         />
       )}


        <section className="search-section">
          <div className="section-intro">
            <span className="eyebrow">ALERT OPERATIONS</span>

            <h2>Select an Alert</h2>

            <p>
              Search the alert library or filter procedures by severity
              and notification requirement.
            </p>
          </div>

          <div className="procedure-actions">
            <div className="procedure-count">
              <strong>{filteredAlerts.length}</strong>
              <span>Procedures</span>
            </div>

            <button
              className="add-alert-button"
              type="button"
              onClick={() => setShowAddAlert(true)}
            >
              <Plus size={17} />
              ADD NEW ALERT
            </button>
          </div>

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <FilterBar
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </section>

        <AlertSummary 
          alerts={alerts}
          activitySummary={activitySummary}
          activitySummaryError={activitySummaryError}
          recentActivities={recentActivities}
          recentActivityError={recentActivityError}  
        />

        <section className="alert-section">
          {loading && (
            <div className="status-message">
              Loading alert procedures...
            </div>
          )}

          {!loading && error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && deleteError && (
            <p className="error-message" role="alert">
              {deleteError}
            </p>
          )}

          {!loading && !error && filteredAlerts.length === 0 && (
            <div className="empty-state">
              <CircleAlert size={32} />

              <h3>No alerts found</h3>

              <p>
                Try changing your search or filter, or add a new alert.
              </p>
            </div>
          )}

          {!loading && !error && filteredAlerts.length > 0 && (
            <div className="alert-grid">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  onOpen={() => setSelectedAlert(alert)}
                  onEdit={(selected) => {
                    setShowAddAlert(false);
                    setAlertToEdit(selected);
                  }}

                  onHistory={(selected) => setHistoryAlert(selected)}
                  onDelete={handleDeleteAlert}
                  deleting={deletingAlertId === alert._id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;