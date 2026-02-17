# Local Testing Guide

## Current Status

- **Backend (Django):** Running on http://localhost:8002
- **Frontend (Next.js):** Running on http://localhost:3000, 3001, 3002, or 3003 (first available)

## Quick Start

### 1. Backend (Django)

```powershell
cd ludmilportifolio
python manage.py migrate --settings=ludmilportifolio.settings_local
python seed_local_data.py
$env:DJANGO_SETTINGS_MODULE='ludmilportifolio.settings_local'; python create_test_users.py
python manage.py runserver 8002 --settings=ludmilportifolio.settings_local
```

### 2. Frontend (Next.js)

```powershell
cd portifolio
# Ensure .env.local has: DJANGO_API_URL=http://localhost:8002
yarn dev
```

### 3. Run Tests

**Backend only** (no frontend needed):
```powershell
cd portifolio
node scripts/test-local-direct.mjs
```

**Full stack** (requires both running):
```powershell
$env:FRONTEND_URL='http://localhost:3003'; node scripts/test-live-portals.mjs
```

## Test Credentials

- **Admin:** `admin` / `admin123`
- **Client:** `client_test` / `client123`
- **Dashboard:** http://localhost:3001/dashboard/login

## What Gets Tested

**test-local-direct.mjs** (backend only):
- `/my_info/`, `/testimonials/`, admin login, client login, project inquiry, get inquiries

**test-live-portals.mjs** (full stack):
- Admin/client login, inquiries, project inquiry, page accessibility
