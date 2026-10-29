import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9090"
).replace(/\/+$/, "");

const API_URL = `${BASE_URL}/api/appraisels`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

const appraisalService = {
  // Calculate revised salary
  calculateSalary: async (data) => {
    const response = await api.post(
      "/api/appraisels/calculate",
      data
    );

    return response.data;
  },

  // Create and save an appraisal
  createAppraisal: async (data) => {
    const response = await api.post(
      "/api/appraisels",
      data
    );

    return response.data;
  },

  // Retrieve an appraisal by ID
  getAppraisal: async (id) => {
    const response = await api.get(
      `/api/appraisels/${encodeURIComponent(id)}`
    );

    return response.data;
  },


  // Email the saved appraisal PDF to the employee email stored with the record
  sendAppraisalEmail: async (id) => {
    const response = await api.post(
      `/api/appraisels/${encodeURIComponent(id)}/email`
    );
    return response.data;
  },

  // Download appraisal PDF
  downloadPdf: async (id) => {
    const response = await api.get(
      `/api/appraisels/${encodeURIComponent(id)}/pdf`,
      {
        responseType: "blob",
      }
    );

    const pdfBlob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `appraisal-${id}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  },
};

// Retrieve all appraisals
export const getAppraisals = async () => {
  const response = await api.get("/api/appraisels");
  return response.data;
};

// Save an appraisal
export const saveAppraisal = appraisalService.createAppraisal;

// Export the configured Axios instance
export { api };

export default appraisalService;