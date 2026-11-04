import CompanyLogo from "./CompanyLogo";

export default function Header({ searchTerm, setSearchTerm, onSearch, results = [], onSelect }) {
  return (
    <header className="page-header">
      <div className="brand-area">
        <CompanyLogo />
      </div>
      <div className="header-search">
        <label htmlFor="previous-search">Find a Previously Generated Letter</label>
        <form onSubmit={onSearch}>
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              id="previous-search"
              type="search"
              maxLength={60}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by employee name or ID"
            />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
        {results.length > 0 && (
          <div className="search-results">
            {results.map((record) => (
              <button type="button" key={record.id} onClick={() => onSelect(record)}>
                <strong>{record.employeeName}</strong>
                <span>{record.employeeId || record.id} · {record.designation}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="page-heading">
        <h1>Appraisal Letter Generator</h1>
        <p>Generate, store and send employee appraisal letters</p>
      </div>
    </header>
  );
}
