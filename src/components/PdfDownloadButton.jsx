import appraisalService from "../services/appraisalService";

export default function PdfDownloadButton({ appraisalId }) {
  const downloadPdf = async () => {
    if (!appraisalId) {
      window.print();
      return;
    }
    try {
      await appraisalService.downloadPdf(appraisalId);
    } catch {
      window.alert("Could not download the server-generated PDF. Please check the backend connection.");
    }
  };

  return (
    <button type="button" className="download-button" onClick={downloadPdf}>
      Download Appraisal PDF
    </button>
  );
}
