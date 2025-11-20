# SwTesing Reservation API

## Setup

```bash
cd Backend
npm install
npm run dev
```

Create `Backend/.env` with:

```
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/swtesing_reservations
SECRET_KEY=replace_me
CLIENT_URL=http://localhost:3000
```

`DB_URL` can target MongoDB Atlas; URL‑encode any special characters in the username/password.

## Reservation Endpoints

| Method | Path                     | Description                        | Auth          |
| ------ | ------------------------ | ---------------------------------- | ------------- |
| POST   | `/api/users/reservations`| Customer creates reservation       | Customer JWT  |
| GET    | `/api/users/reservations`| View reservations for current user | Customer JWT  |
| GET    | `/api/reservations`      | Admin views all reservations       | Admin JWT     |
| PATCH  | `/api/reservations/:id`  | Admin updates reservation status   | Admin JWT     |

### JWT Expectations

- Token can be sent either via cookie `token` or `Authorization: Bearer <token>` header (ideal for Postman).
- JWT payload must include `id` or `_id` and `role`.

### Typical Flow (Postman)

1. Authenticate through your existing login endpoint to receive a JWT.
2. Use the JWT in subsequent requests (cookie or Bearer header).
3. POST `/api/users/reservations` with `{ "date": "2025-12-01", "time": "19:00", "numberOfGuests": 4 }`.
4. GET `/api/users/reservations` to confirm booking.
5. Admin uses GET `/api/reservations` and PATCH `/api/reservations/:id` to manage reservations.

## Reliability & Integrity

- Reservation schema enforces unique `{ date, time }` combinations (for active reservations) to prevent double bookings.
- Controllers validate payloads and ensure only admins can view/update all reservations.
- Server exposes `/health` for uptime checks and validates payloads through `express-validator`.