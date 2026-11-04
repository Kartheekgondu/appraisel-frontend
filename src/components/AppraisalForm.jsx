import { useEffect, useState } from "react";
import appraisalService from "../services/appraisalService";
import EmployeeDetails from "./EmployeeDetails";
import AppraisalLetterPreview from "./AppraisalLetterPreview";
import PdfDownloadButton from "./PdfDownloadButton";

const emptyForm = {
  employeeName: "", employeeId: "", employeeEmail: "", designation: "",
  department: "", currentCtc: "", revisedCtc: "", effectiveDate: "",
  variablePay: "0", employeePf: "0", employerPf: "0", professionalTax: "200",
};

export default function AppraisalForm({ selectedRecord, clearSelectedRecord }) {
  const [form, setForm] = useState(emptyForm);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savedAppraisalId, setSavedAppraisalId] = useState(null);

  useEffect(() => {
    if (!selectedRecord) return;
    setForm({
      employeeName: selectedRecord.employeeName || "", employeeId: selectedRecord.employeeId || "",
      employeeEmail: selectedRecord.employeeEmail || "", designation: selectedRecord.designation || "",
      department: selectedRecord.department || "", currentCtc: String(selectedRecord.currentCtc ?? ""),
      revisedCtc: String(selectedRecord.revisedCtc ?? ""), effectiveDate: selectedRecord.effectiveDate || "",
      variablePay: String(selectedRecord.variablePay ?? 0), employeePf: String(selectedRecord.employeePf ?? 0),
      employerPf: String(selectedRecord.employerPf ?? 0), professionalTax: String(selectedRecord.professionalTax ?? 200),
    });
    setSavedAppraisalId(selectedRecord.id);
    setIsGenerated(true);
    setError(""); setEmailMessage(""); setEmailError("");
    clearSelectedRecord?.();
  }, [selectedRecord, clearSelectedRecord]);

  const updateField = (name, value) => {
    setForm((previous) => {
      const next = { ...previous, [name]: value };
      if (name === "revisedCtc") {
        const basic = Math.max(0, Number(value) || 0) / 12 * 0.5;
        const pf = basic >= 25000 ? 3000 : basic * 0.12;
        next.employeePf = String(pf);
        next.employerPf = String(pf);
        next.professionalTax = "200";
      }
      return next;
    });
    setIsGenerated(false);
    setSavedAppraisalId(null);
    setError("");
    setEmailMessage("");
    setEmailError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const current = Number(form.currentCtc);
    const revised = Number(form.revisedCtc);
    const employeeName = form.employeeName.trim();
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(employeeName)) {
      setError("Employee Name must start with an English letter and contain at most one space between words."); return;
    }
    if (!form.employeeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.employeeEmail)) {
      setError("Enter a valid employee email address."); return;
    }
    if (!Number.isFinite(current) || current <= 0) {
      setError("Current Annual CTC must be greater than ₹0."); return;
    }
    if (!Number.isFinite(revised) || revised <= current) {
      setError("Revised Annual CTC must be greater than Current Annual CTC."); return;
    }
    setError(""); setIsSaving(true);
    try {
      const payload = {
        ...form, employeeName, currentCtc: current, revisedCtc: revised,
        variablePay: Number(form.variablePay), employeePf: Number(form.employeePf),
        employerPf: Number(form.employerPf), professionalTax: Number(form.professionalTax),
      };
      const saved = await appraisalService.createAppraisal(payload);
      setSavedAppraisalId(saved.id);
      setIsGenerated(true);
      setEmailMessage(""); setEmailError("");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error ||
        "Could not save appraisal. Check that the backend and SQL database are running.");
    } finally { setIsSaving(false); }
  };

  const handleSendEmail = async () => {
    if (!savedAppraisalId) return;
    setIsSendingEmail(true); setEmailMessage(""); setEmailError("");
    try {
      const result = await appraisalService.sendAppraisalEmail(savedAppraisalId);
      setEmailMessage(result.message || `Appraisal PDF sent to ${form.employeeEmail}.`);
    } catch (err) {
      setEmailError(err.response?.data?.message || err.response?.data?.error ||
        "Email could not be sent. Check the recipient address and backend SMTP settings.");
    } finally { setIsSendingEmail(false); }
  };

  const incrementPercentage = Number(form.currentCtc) > 0
    ? ((Number(form.revisedCtc) - Number(form.currentCtc)) / Number(form.currentCtc)) * 100 : 0;

  return (
    <main className="appraisal-container">
      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <EmployeeDetails form={form} updateField={updateField} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="generate-button" disabled={isSaving}>
            {isSaving ? "Saving..." : "Generate Appraisal Letter"}
          </button>
        </form>
      </section>

      <div className="appraisal-actions">
        <PdfDownloadButton appraisalId={savedAppraisalId} disabled={!isGenerated} />
        <button type="button" className="action-button edit-button" disabled={!isGenerated}
          onClick={() => { setIsGenerated(false); setSavedAppraisalId(null); }}>
          <span aria-hidden="true">✎</span> Edit Letter
        </button>
        <button type="button" className="action-button email-send-button"
          onClick={handleSendEmail} disabled={!isGenerated || isSendingEmail}>
          <span aria-hidden="true">✉</span> {isSendingEmail ? "Sending..." : "Email Appraisal Letter"}
        </button>
      </div>
      {emailMessage && <p className="email-success" role="status">{emailMessage}</p>}
      {emailError && <p className="form-error" role="alert">{emailError}</p>}

      {isGenerated ? (
        <section className="generated-result">
          <div className="result-toolbar">
            <div><h2>Appraisal Letter Generated</h2>
              <p>Increment Percentage: <strong>{incrementPercentage.toFixed(2)}%</strong></p>
            </div>
          </div>
          <AppraisalLetterPreview form={form} incrementPercentage={incrementPercentage} salarySettings={form} />
        </section>
      ) : (
        <p className="empty-letter-message">No letter generated yet. Fill in the form and click "Generate Appraisal Letter".</p>
      )}

    </main>
  );
}
