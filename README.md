# Migcoin Admin Platform

Full-stack admin application for managing users and device models, with email-based activation and password reset.

## Stack
- Frontend: Angular 17 (`MigcoinApplication/`)
- Backend: Node.js + Express + MongoDB (`backend/`)
- Email: Nodemailer (Gmail SMTP)
- Optional runtime: Docker Compose

## Repository Structure
```text
backend/                Express API + Mongo models + email service
MigcoinApplication/     Angular web application
docker-compose.yml      Local container orchestration
docker-compose.ci.yml   CI container orchestration
```

## Features
- Superuser login
- User management (create/list/update/delete)
- User email activation flow
- Device model management
- Device activation flow
- Dashboard summary endpoint
- Forgot password / reset password flow

## Prerequisites
- Node.js 18+ (recommended)
- npm
- MongoDB (local or remote)
- Gmail account/app password for SMTP (if email sending is enabled)

## Environment Variables (Backend)
Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/cloud_app_db
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:4200
```

Notes:
- `FRONTEND_URL` is used in email links (activation/reset).
- If `FRONTEND_URL` is missing, backend currently falls back to `http://localhost:4200` for links.

## Run Locally (Without Docker)
Open two terminals:

1. Backend
```bash
cd backend
npm install
node server.js
```

2. Frontend
```bash
cd MigcoinApplication
npm install
npm start
```

App URLs:
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`

## Password Reset Flow (Localhost)
1. Open login page and click **Forget Password?**
2. Submit email on `/forgot-password`
3. Open reset link from email (`/reset-password?token=...&email=...`)
4. Set a new password
5. Login again

Backend endpoints:
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`

## Run with Docker
From repo root:

```bash
docker compose up --build
```

Services:
- MongoDB: `27017`
- Backend: `3000`
- Frontend (Nginx): `80`

## Useful Frontend Commands
From `MigcoinApplication/`:

```bash
npm start
npm run build
npm test
```

## Troubleshooting
- `MONGO_URI is not defined`: add `MONGO_URI` in `backend/.env`.
- Email not sending: verify `EMAIL_USER` and Gmail app password in `EMAIL_PASSWORD`.
- Reset/activation link opens wrong host: set `FRONTEND_URL` correctly in `backend/.env`.
- CORS/API issues on localhost: ensure frontend calls `http://<host>:3000/api` and backend is running on port `3000`.
