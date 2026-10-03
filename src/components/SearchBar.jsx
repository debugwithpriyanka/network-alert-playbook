import { Search, X } from "lucide-react";

function SearchBar({ search, setSearch }) {
  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="search-wrapper">
      <Search className="search-icon" size={21} />

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search alert type..."
        aria-label="Search alert type"
      />

      {search && (
        <button
          className="clear-search"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;