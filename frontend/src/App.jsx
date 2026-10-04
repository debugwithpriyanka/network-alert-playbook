import { useMemo, useState } from "react";
import { CircleAlert } from "lucide-react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AlertCard from "./components/AlertCard";

import { alertProcedures } from "./data/alertProcedures";

function App() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState("All Alerts");

  const filteredAlerts = useMemo(() => {
    return alertProcedures.filter((alert) => {
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

      if (
        selectedFilter ===
        "Customer Notification Required"
      ) {
        matchesFilter = alert.notification
          .toLowerCase()
          .includes("required");
      }

      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter]);

  return (
    <div className="app">
      <Header />

      <main className="dashboard">

        {/* SEARCH SECTION */}

        <section className="search-section">
          <div className="section-intro">

            <div>
              <span className="eyebrow">
                ALERT OPERATIONS
              </span>

              <h2>Select an Alert</h2>

              <p>
                Search the alert library or filter procedures
                by severity and notification requirement.
              </p>
            </div>

            <div className="procedure-count">
              <strong>
                {filteredAlerts.length}
              </strong>

              <span>Procedures</span>
            </div>

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


        {/* ALERT PROCEDURES */}

        <section className="alert-section">

          <div className="alert-section-header">
            <div>
              <span className="eyebrow">
                SOP LIBRARY
              </span>

              <h2>Alert Procedures</h2>
            </div>

            <span className="results-label">
              Showing {filteredAlerts.length} procedures
            </span>
          </div>


          {filteredAlerts.length > 0 ? (

            <div className="alert-grid">

              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onOpen={() =>
                    console.log(
                      "Selected alert:",
                      alert.title
                    )
                  }
                />
              ))}

            </div>

          ) : (

            <div className="empty-state">

              <CircleAlert size={30} />

              <h3>
                No alert procedures found
              </h3>

              <p>
                Try another search term or select
                a different filter.
              </p>

            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default App;