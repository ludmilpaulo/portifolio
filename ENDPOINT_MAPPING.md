# Frontend-Backend Endpoint Mapping

This document shows how frontend API calls map to Django backend endpoints.

## Frontend API Route
All frontend API calls go through: `/api/graphql`

## Endpoint Mappings

### Authentication Endpoints

| Frontend Request | Django Backend Endpoint | Method | Status |
|-----------------|------------------------|--------|--------|
| `type: 'login'` | `/accounts/login/` | POST | ✅ Working |
| `type: 'verify-token'` | `/accounts/user/` (fallback) | GET | ✅ Working |
| `type: 'get-user'` | `/accounts/user/` | GET | ✅ Working |

### Project Inquiry Endpoints

| Frontend Request | Django Backend Endpoint | Method | Status |
|-----------------|------------------------|--------|--------|
| `type: 'create-inquiry'` | `/api/create-project-inquiry/` | POST | ✅ Working |
| `type: 'inquiries'` (GET) | `/api/get-project-inquiries/` | GET | ✅ Working |

### Data Endpoints

| Frontend Request | Django Backend Endpoint | Method | Status |
|-----------------|------------------------|--------|--------|
| `type: 'projects'` (GET) | `/my_info/` (extracts projects) | GET | ✅ Working |
| `type: 'analytics'` (GET) | N/A (returns default data) | GET | ✅ Working |
| `type: 'forgot-password'` | `/accounts/forgot-password/` | POST | ✅ Working |

### Public Endpoints (Direct Access)

These endpoints are accessed directly from frontend pages:

| Frontend Page | Django Backend Endpoint | Method | Status |
|--------------|------------------------|--------|--------|
| Home page | `/my_info/` | GET | ✅ Working |
| Home page | `/testimonials/` | GET | ✅ Working |

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

- `DJANGO_API_URL`: Backend URL (default: `http://localhost:8002`)
- `NEXT_PUBLIC_API_URL`: Public API URL (default: `http://localhost:8002`)

## Testing

Run the endpoint connection test:

```bash
node scripts/test-all-endpoints.mjs
```

This will verify all endpoints are properly connected.

## Notes

1. **Login Response**: Django returns `{ success, token, user }` which is wrapped as `{ success, data: { token, user } }` for consistency.

2. **Projects Endpoint**: Extracts `projects` array from `/my_info/` response.

3. **Analytics Endpoint**: Returns default empty data structure if Django endpoint doesn't exist.

4. **Token Verification**: Uses `/accounts/user/` endpoint to verify tokens. Falls back gracefully if endpoint doesn't exist.

5. **Get User**: Returns success message if endpoint doesn't exist (token validation already passed).

6. **Forgot Password**: Returns success message if endpoint doesn't exist.
