
# Symposium Central API Endpoints

This document outlines the backend API endpoints required to support the Symposium Central frontend application.

## Authentication Endpoints

- **`POST /api/auth/login`**: Authenticates a user (superadmin or department admin) and returns a session token (e.g., JWT).
  - **Request Body**: `{ "email": "user@example.com", "password": "..." }`
  - **Response**: `{ "token": "...", "user": { ... } }`

- **`POST /api/auth/logout`**: Invalidates the user's session token.
  - **Response**: `200 OK`

- **`GET /api/auth/me`**: Retrieves the profile of the currently authenticated user.
  - **Response**: `{ "user": { ... } }`

- **`POST /api/auth/google`**: Handles authentication using Google OAuth.
  - **Request Body**: `{ "token": "google_auth_token" }`
  - **Response**: `{ "token": "...", "user": { ... } }`
  
- **`POST /api/register`**: Handles new user registration for event participants.
  - **Request Body**: `{ "name": "...", "email": "...", "password": "...", "college": "..." }`
  - **Response**: `{ "user": { ... } }`

---

## Event Management Endpoints

- **`GET /api/events`**: Retrieves a list of all events.
  - **Query Parameters**: `?departmentId=cse`, `?mode=online`, `?category=technical`
  - **Response**: `[ { "id": "...", "name": "...", ... } ]`

- **`POST /api/events`**: Creates a new event. (Admin only)
  - **Request Body**: `{ "name": "...", "description": "...", "date": "...", ... }`
  - **Response**: `{ "id": "...", "name": "...", ... }`

- **`GET /api/events/{eventId}`**: Retrieves detailed information for a specific event.
  - **Response**: `{ "id": "...", "name": "...", "participants": [ ... ], ... }`

- **`PUT /api/events/{eventId}`**: Updates an existing event. (Admin only)
  - **Request Body**: `{ "name": "...", "description": "...", ... }`
  - **Response**: `{ "id": "...", "name": "...", ... }`

- **`DELETE /api/events/{eventId}`**: Deletes an event. (Admin only)
  - **Response**: `204 No Content`

---

## Registration & Participant Endpoints

- **`POST /api/events/{eventId}/register`**: Registers a user for a specific event.
  - **Request Body**: `{ "userId": "...", "paymentScreenshotUrl": "..." }` (if applicable)
  - **Response**: `{ "registrationId": "...", ... }`

- **`GET /api/events/{eventId}/participants`**: Retrieves a list of all participants for a specific event. (Admin only)
  - **Response**: `[ { "id": "...", "name": "...", "email": "...", ... } ]`
  
- **`GET /api/users/registered`**: Retrieves a list of all unique users who have registered for any event. (Admin only)
  - **Response**: `[ { "id": "...", "name": "...", "email": "...", ... } ]`

---

## Department Management Endpoints (Superadmin Only)

- **`GET /api/departments`**: Retrieves a list of all departments.
  - **Response**: `[ { "id": "...", "name": "...", "head": { ... } } ]`

- **`POST /api/departments`**: Creates a new department.
  - **Request Body**: `{ "id": "...", "name": "...", "head": { ... } }`
  - **Response**: `{ "id": "...", "name": "...", ... }`

- **`PUT /api/departments/{departmentId}`**: Updates an existing department.
  - **Request Body**: `{ "name": "...", "head": { ... } }`
  - **Response**: `{ "id": "...", "name": "...", ... }`

- **`DELETE /api/departments/{departmentId}`**: Deletes a department.
  - **Response**: `204 No Content`

---

## Winner Management Endpoints (Admin Only)

- **`POST /api/events/{eventId}/winners`**: Adds or updates winners for an event.
  - **Request Body**: `[ { "userId": "...", "position": 1, "prizeAmount": 500 }, ... ]`
  - **Response**: `{ "winners": [ ... ] }`

- **`GET /api/events/{eventId}/winners`**: Retrieves the list of winners for an event.
  - **Response**: `[ { "id": "...", "position": 1, "user": { ... } } ]`

---

## Financial Endpoints (Superadmin Only)

- **`GET /api/finance/summary`**: Retrieves an overall financial summary (total revenue, total prizes, etc.).
  - **Response**: `{ "totalRevenue": ..., "totalPrizes": ..., "netIncome": ... }`

- **`GET /api/finance/events/{eventId}`**: Retrieves a financial summary for a specific event.
  - **Response**: `{ "revenue": ..., "prizes": ..., "netIncome": ... }`

---

