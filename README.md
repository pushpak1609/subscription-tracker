# SubDub — Subscription Tracker API

A backend REST API that lets users track their subscriptions and automatically
emails them renewal reminders before each subscription renews.

Built with Node.js, Express, and MongoDB, following the
["Complete Backend Course | Build and Deploy Your First Production-Ready API"](https://www.youtube.com/@javascriptmastery)
tutorial by JavaScript Mastery, with additional features (role-based admin
access, security fixes) added on top.

## Features

- **Auth** — JWT-based sign-up/sign-in with bcrypt password hashing
- **User management** — profile CRUD, ownership-restricted (admins can manage any user)
- **Subscription tracking** — full CRUD, cancel, and upcoming-renewals endpoints
- **Role-based access control** — normal users can only access their own data; a single admin account can access everyone's
- **Automated renewal reminders** — durable background workflow (Upstash) sends templated emails 7, 5, 2, and 1 day(s) before each subscription renews
- **Rate limiting & bot protection** — via Arcjet (shield, bot detection, token bucket rate limiting)

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express 4 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Security | Arcjet (rate limiting, bot detection, shield) |
| Background jobs | Upstash Workflow + Upstash QStash |
| Email | Nodemailer (Gmail SMTP) |
| Dates | dayjs |

## Project structure

```
subscription-tracker/
├── config/          env.js, arcjet.js, upstash.js, nodemailer.js
├── controllers/     auth, user, subscription, workflow
├── database/        mongodb.js connection
├── middlewares/      auth.middleware.js, error.middleware.js, arcjet.middleware.js
├── models/           user.model.js, subscription.model.js
├── routes/           auth, user, subscription, workflow routes
├── utils/            email-template.js, email-template.data.js, send-email.js
└── app.js
```

## Prerequisites

- Node.js 18+ 
- A MongoDB Atlas cluster (or local MongoDB instance)
- An [Arcjet](https://app.arcjet.com) account + API key
- An [Upstash](https://console.upstash.com) account (QStash for durable workflows)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) generated (requires 2FA)

## Setup

1. **Clone the repo and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd subscription-tracker
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env.development.local` and fill in real values:
   ```bash
   cp .env.example .env.development.local
   ```
   See `.env.example` for the full list of required variables and where to get each one.

3. **Run the QStash local dev server** (needed for renewal-reminder workflows to trigger locally)

   In a separate terminal:
   ```bash
   npx @upstash/qstash-cli dev
   ```
   This runs on `127.0.0.1:8080` by default. Point `QSTASH_URL` in your `.env` at this local server during development.

4. **Start the app**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000` (or whatever `PORT` you set).

   > Both the QStash dev server and the app must be running at the same time for renewal-reminder workflows to trigger and complete.

## Setting up the admin account

There is no signup field or endpoint for creating an admin — this is intentional,
to prevent self-promotion. To make a user an admin:

1. Sign up normally through `POST /api/v1/auth/sign-up`.
2. Open your MongoDB Atlas cluster → Browse Collections → `users` collection.
3. Find that user's document and edit it directly.
4. Set the `role` field to the string `admin` (unquoted field name, quoted string value — same format as the other fields like `name` and `email`).
5. Save. Sign in again to get a fresh token — the middleware re-checks the role from the database on every request, so no code changes or restarts are needed.

Admins can access every `/users` and `/subscriptions` endpoint for any user.
Normal users are restricted to their own account and subscriptions only.

## API overview

### Auth — `/api/v1/auth` (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/sign-up` | Create a new account |
| POST | `/sign-in` | Log in and receive a JWT |

### Users — `/api/v1/users` (requires auth)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/` | Admin only — list all users |
| GET | `/:id` | Own account, or any account if admin |
| PUT | `/:id` | Own account, or any account if admin |
| DELETE | `/:id` | Own account, or any account if admin |

### Subscriptions — `/api/v1/subscriptions` (requires auth)
| Method | Endpoint | Access |
|---|---|---|
| GET | `/` | Own subscriptions, or all if admin |
| GET | `/:id` | Own subscription, or any if admin |
| POST | `/` | Create a subscription (owned by the requester) |
| PUT | `/:id` | Own subscription, or any if admin |
| PUT | `/:id/cancel` | Own subscription, or any if admin |
| DELETE | `/:id` | Own subscription, or any if admin |
| GET | `/user/:id` | Own id, or any id if admin |
| GET | `/upcoming-renewals` | Own subscriptions renewing in the next 7 days |

### Workflows — `/api/v1/workflows` (internal — called by Upstash, not by clients)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/subscription/reminder` | Triggered by Upstash Workflow; sends renewal reminder emails at 7, 5, 2, and 1 day(s) before renewal |

## Known limitations / not yet implemented

- No frontend — this is a backend-only API, tested via Postman
- No request validation library (e.g. zod, express-validator) — only Mongoose schema-level validation
- CORS is not yet configured — will be needed once a frontend is added
- Email sending currently uses a personal Gmail account via Nodemailer; a dedicated transactional email service (Resend, SendGrid, SES, Postmark) is recommended for real production use due to Gmail's sending limits
- No sign-out endpoint — JWT invalidation is currently a frontend-only concern (client discards the token)

## License
