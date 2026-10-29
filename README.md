# Appraisal Letter Frontend (React + Vite)

## Requirements
- Node.js 20.19+ or 22.12+
- Backend running at `http://localhost:9090`

## Run
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally `http://localhost:5173`).

If the backend runs at a different address, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`, then restart Vite.

The page submits appraisal forms to Spring Boot and shows saved appraisal records returned by `GET /api/appraisels`. Use the Refresh button to reload the table.


## Appraisal letter template styling
The letter preview uses the supplied template styling: Calibri/Carlito, 15px body text, logo max 200x52px, centered blue title, salary table with borders, and blue GST footer. The print stylesheet switches to A4 PDF-friendly sizes.
