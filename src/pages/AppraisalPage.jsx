import { useCallback, useState } from "react";
import Header from "../components/Header";
import AppraisalForm from "../components/AppraisalForm";
import { getAppraisals } from "../services/appraisalService";
import "../styles/App.css";
import "../styles/AppraisalLetter.css";

export default function AppraisalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    setSearchError("");
    try {
      const records = await getAppraisals(searchTerm.trim());
      setSearchResults(Array.isArray(records) ? records : []);
      if (!records?.length) setSearchError("No previously generated letters found.");
    } catch (error) {
      setSearchError(error.response?.data?.message || "Could not search saved letters. Check the backend connection.");
      setSearchResults([]);
    }
  };
  const clearSelectedRecord = useCallback(() => setSelectedRecord(null), []);

  return (
    <div className="app">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        onSearch={handleSearch} results={searchResults} onSelect={(record) => { setSelectedRecord(record); setSearchResults([]); setSearchError(""); }} />
      {searchError && <p className="search-feedback">{searchError}</p>}
      <AppraisalForm selectedRecord={selectedRecord} clearSelectedRecord={clearSelectedRecord} />
    </div>
  );
}
