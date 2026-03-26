# Freedom Stack

TypeScript rebuild of the `french-stack` physiotherapy booking platform using:

- Next.js App Router
- Payload CMS
- PostgreSQL
- Nodemailer for booking emails

## What is already implemented

- Payload CMS with collections for:
  - `admins`
  - `services`
  - `time-slots`
  - `testimonials`
  - `bookings`
  - `media`
- Payload global for `brand-settings`
- Public pages:
  - `/`
  - `/services`
  - `/book`
  - `/booking/confirmed`
  - `/login` -> redirects to `/admin`
- Booking API routes:
  - `POST /api/booking`
  - `GET /api/booking/slots`
- Booking transaction logic with slot locking via PostgreSQL
- Booking confirmation and internal notification emails via SMTP
- Seed script for admin user, services, testimonials, brand settings, and time slots

## Local setup

1. Copy `.env.example` to `.env`
2. Update `DATABASE_URL` to point at the new PostgreSQL database on port `5552`
3. Set a real `PAYLOAD_SECRET`
4. Install dependencies

```bash
pnpm install
```

5. Bootstrap the local database and seed baseline CMS content

```bash
pnpm setup
```

6. Generate Payload artifacts if needed

```bash
pnpm payload:sync
```

7. Start the app

```bash
pnpm dev
```

## Important notes

- The project intentionally keeps the Laravel **domain model** and booking flow, but the admin/auth layer is now Payload-native.
- The booking flow uses direct PostgreSQL transactions for correctness under concurrent booking attempts.
- `PAYLOAD_SECRET` falls back to a local development value so builds work in a fresh environment, but production must override it.
- `pnpm setup` starts PostgreSQL on `127.0.0.1:5552` and runs the seed script that creates the first admin plus baseline services, testimonials, brand settings, and time slots.
- Payload import map and types are committed to the repo. `pnpm install` does not regenerate them automatically; use `pnpm payload:sync` after changing Payload schema or admin component imports.
