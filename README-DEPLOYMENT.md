# Appraisel React Frontend — Vercel + Spring Boot on Render

## Backend connection

This frontend is configured to call the Spring Boot backend at:

`https://appraisel-backend.onrender.com`

The backend controller in the supplied backend project uses the base path `/api/appraisels`.
The frontend service calls these matching endpoints:

- `GET /api/appraisels` — list saved appraisals
- `POST /api/appraisels` — create/save appraisal
- `POST /api/appraisels/calculate` — calculate salary
- `GET /api/appraisels/{id}` — retrieve appraisal
- `POST /api/appraisels/{id}/email` — send appraisal email
- `GET /api/appraisels/{id}/pdf` — download PDF
- `GET /api/appraisels/health` — backend health check

## Deploy to Vercel

1. Push this project folder to GitHub (do not upload `node_modules`, `dist`, or local secrets).
2. In Vercel, import the GitHub repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add this environment variable in Vercel Project → Settings → Environment Variables:

   `VITE_API_BASE_URL=https://appraisel-backend.onrender.com`

7. Apply it to Production (and Preview if required), save, then redeploy.

The project includes `.env.production` with the same production backend URL as a fallback. Vercel's configured environment variable takes precedence at build time.

## Required backend CORS setting

The backend source provided with this project reads `FRONTEND_URL` in `CorsConfig`.
In Render → backend service → Environment, set:

`FRONTEND_URL=https://YOUR-VERCEL-PROJECT.vercel.app`

Use your actual Vercel production origin only: scheme + hostname, with no path and no trailing slash. If you use a Vercel custom domain, configure that exact domain too. The backend must be redeployed after changing the variable.

The backend CORS mapping in the supplied source allows `/api/**`, `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS`, with all headers. If the frontend uses a Vercel preview URL, that origin must also be allowed by the backend; the supplied backend currently accepts one `FRONTEND_URL` origin.

## Local development

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Set `VITE_API_BASE_URL=http://localhost:9090` in `.env.local`.
4. Run `npm run dev`.
5. Verify using `npm run build`.

## Notes

- Render free services may sleep when idle; the first API request can take longer while the service wakes.
- The backend root URL may return 404. Test `https://appraisel-backend.onrender.com/api/appraisels/health` instead.
- Do not commit `.env.local`, passwords, SMTP credentials, or database secrets.
