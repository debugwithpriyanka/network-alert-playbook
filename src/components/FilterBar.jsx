import {
  BellRing,
  CircleAlert,
  CircleCheck,
  Flame,
  Filter,
} from "lucide-react";

const filters = [
  {
    label: "All Alerts",
    value: "All Alerts",
    icon: Filter,
  },
  {
    label: "Critical",
    value: "Critical",
    icon: CircleAlert,
  },
  {
    label: "High",
    value: "High",
    icon: Flame,
  },
  {
    label: "Medium",
    value: "Medium",
    icon: CircleAlert,
  },
  {
    label: "Low",
    value: "Low",
    icon: CircleCheck,
  },
  {
    label: "Customer Notification Required",
    value: "Customer Notification Required",
    icon: BellRing,
  },
];

function FilterBar({ selectedFilter, setSelectedFilter }) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => {
        const Icon = filter.icon;

        const isActive = selectedFilter === filter.value;

        return (
          <button
            key={filter.value}
            className={`filter-button ${isActive ? "active" : ""}`}
            onClick={() => setSelectedFilter(filter.value)}
          >
            <Icon size={15} />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;