import appraisalService from "../services/appraisalService";

export default function PdfDownloadButton({ appraisalId, disabled = false }) {
  const downloadPdf = async () => {
    if (!appraisalId) return;
    try {
      await appraisalService.downloadPdf(appraisalId);
    } catch {
      window.alert("Could not download the server-generated PDF. Please check the backend connection.");
    }
  };
  return (
    <button type="button" className="download-button" onClick={downloadPdf} disabled={disabled || !appraisalId}>
      <span aria-hidden="true">↓</span> Download as PDF
    </button>
  );
}
