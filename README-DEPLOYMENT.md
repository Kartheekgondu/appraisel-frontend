# Appraisel React frontend — Vercel proxy to Spring Boot on Render

## Architecture

- React/Vite frontend: deployed on Vercel.
- Spring Boot API: `https://appraisel-backend.onrender.com` (runs on Render).
- Vercel proxies browser requests from `/backend/*` to the Render backend. The browser therefore calls the Vercel origin, avoiding browser CORS for these proxied requests.

## Vercel configuration

The root `vercel.json` contains these rewrites in this order:

1. `/backend/:path*` → `https://appraisel-backend.onrender.com/:path*`
2. `/(.*)` → `/index.html` for the React single-page app.

The frontend API client uses `VITE_API_BASE_URL=/backend`. The service calls the existing backend routes:
- `GET /api/appraisels`
- `POST /api/appraisels`
- `POST /api/appraisels/calculate`
- `GET /api/appraisels/{id}`
- `POST /api/appraisels/{id}/email`
- `GET /api/appraisels/{id}/pdf`
- `GET /api/appraisels/health`

For example, the browser requests `/backend/api/appraisels`; Vercel forwards it to `https://appraisel-backend.onrender.com/api/appraisels`.

## Deploy

1. Push the contents of this folder to your frontend GitHub repository. Do not commit `.git`, `node_modules`, or `dist`.
2. Import/select that repository in Vercel.
3. Framework preset: Vite; build command: `npm run build`; output directory: `dist`.
4. In Vercel → Project → Settings → Environment Variables, remove or change any old `VITE_API_BASE_URL` value that points directly to Render. Set it to `/backend` for Production (and Preview if desired).
5. Redeploy after changing environment variables.

`vercel.json` is included in the repository and should be deployed with the frontend. No separate Vercel backend runtime is created: this is a reverse proxy to the Spring Boot service on Render.

## Backend / CORS

The supplied backend CORS configuration accepts comma-separated origins in `FRONTEND_URL`, for direct browser calls if needed. The Vercel proxy path is same-origin and normally does not require CORS. In Render, set `FRONTEND_URL` to your actual Vercel origin (scheme + hostname only), e.g. `https://your-project.vercel.app`. Multiple origins can be comma-separated. Redeploy the backend after changing it.

## Local development

For direct local API calls, create `.env.local` with:
`VITE_API_BASE_URL=http://localhost:8080`
(or the actual local Spring Boot port), then run `npm install` and `npm run dev`.

## Troubleshooting

- Test the backend directly at `https://appraisel-backend.onrender.com/api/appraisels/health`.
- Test the Vercel proxy at `https://YOUR-VERCEL-DOMAIN/backend/api/appraisels/health`.
- If the direct backend health URL works but the Vercel proxy does not, check that the latest Vercel deployment includes the root `vercel.json`.
- If health works but saved records fail, inspect Render logs and verify the MySQL environment variables and database connectivity.
- Render free instances can sleep; the first request after inactivity may take time.
