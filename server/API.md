# Active Era API (Release 1)

**Base URL (local):** `http://localhost:5000/api`. In the client, read it from `VITE_API_URL`.

## Run it

```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET (ask the team)
npm run dev            # nodemon, http://localhost:5000
```

`GET /api/health` returns `{ "status": "ok" }`.

## Auth

Protected routes need `Authorization: Bearer <token>`. The Security Programmer is building `/api/auth` (`POST /register`, `POST /login`, `GET /logout`). Until their `protect` middleware is merged, every protected route returns `401`.

Proposed login response (waiting for the Security Programmer to confirm):

```json
{
  "token": "<JWT, expires in 1 day>",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}
```

The password is never returned by any route.

## Endpoints

| Resource | Routes | Access |
|---|---|---|
| `/workouts`, `/sleep`, `/meals`, `/goals` | `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id` | Signed in; `:id` routes are owner only |
| `/users` | `GET /`, `DELETE /:id` | Admin |
| `/users` | `GET /:id`, `PUT /:id` | Owner or admin; only an admin can change `role` |

`GET /` returns only the signed-in user's records, newest `date` first. The server sets `owner` itself, so don't send it.

## Request fields

| Resource | Fields |
|---|---|
| Workout | `exerciseType`, `date`, `durationMinutes` (≥1), `caloriesBurned` (≥0), `notes`? (≤500) |
| Sleep | `date`, `hoursSlept` (0–24), `notes`? |
| Meal | `date`, `mealType` (`breakfast`/`lunch`/`dinner`/`snack`), `foodItems`, `calories` (≥0) |
| Goal | `title`, `category` (`workout`/`sleep`/`nutrition`/`other`), `targetValue`, `unit`, `startDate`, `endDate`?, `status`? (`active`/`achieved`/`cancelled`) |
| User (PUT) | `name`, `email`, `role` (admin only) |

`?` = optional. Send dates as ISO strings, e.g. `"2026-11-14"`.

## Responses

- Single record → object. List → array. Delete → `{ message, id }`.
- Errors → `{ message }`.

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Validation error or bad id |
| 401 | Missing or invalid token |
| 403 | Not your record, or admin only |
| 404 | Not found |
