import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Plus } from "lucide-react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AlertCard from "./components/AlertCard";
import AlertProcedureModal from "./components/AlertProcedureModal";
import AddAlertModal from "./components/AddAlertModal";

import {
  getAlerts,
  createAlert,
  deleteAlert,
} from "./services/api";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAddAlert, setShowAddAlert] = useState(false);

  const [deletingAlertId, setDeletingAlertId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

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

        {showAddAlert && (
          <AddAlertModal
            onClose={() => setShowAddAlert(false)}
            onCreate={handleCreateAlert}
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

