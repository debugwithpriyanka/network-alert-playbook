import { useEffect, useMemo, useState } from "react";
import { CircleAlert, Plus } from "lucide-react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AlertCard from "./components/AlertCard";
import AlertProcedureModal from "./components/AlertProcedureModal";

import { getAlerts } from "./services/api";

function App() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Alerts");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAlert, setSelectedAlert] = useState(null);

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

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        alert.title.toLowerCase().includes(searchText) ||
        alert.description.toLowerCase().includes(searchText);

      let matchesFilter = true;

      if (
        selectedFilter === "Critical" ||
        selectedFilter === "High" ||
        selectedFilter === "Medium" ||
        selectedFilter === "Low"
      ) {
        matchesFilter = alert.severity
          .toUpperCase()
          .includes(selectedFilter.toUpperCase());
      }

      if (selectedFilter === "Customer Notification Required") {
        matchesFilter = alert.notification
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
          <div className="alert-section-header">
            <div>
              <span className="eyebrow">SOP LIBRARY</span>

              <h2>Alert Procedures</h2>
            </div>

            {!loading && !error && (
              <span className="results-label">
                Showing {filteredAlerts.length} procedures
              </span>
            )}
          </div>

          {loading && (
            <div className="empty-state">
              <h3>Loading alert procedures...</h3>
              <p>
                Connecting to the alert management service.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="empty-state">
              <CircleAlert size={30} />

              <h3>Unable to load alerts</h3>

              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredAlerts.length === 0 && (
            <div className="empty-state">
              <CircleAlert size={30} />

              <h3>No alert procedures found</h3>

              <p>
                Try another search term or select a different filter.
              </p>
            </div>
          )}

          {!loading && !error && filteredAlerts.length > 0 && (
            <div className="alert-grid">
               {filteredAlerts.map((alert) => (
                  <AlertCard
                   key={alert.id}
                   alert={alert}
                   onOpen={() => setSelectedAlert(alert)}
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