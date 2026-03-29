<!-- prettier-ignore -->
<h1 align="center">Sky-Pass</h1>

<p align="center">A beautiful, minimal flight booking app built with <strong>Next.js (App Router)</strong>, <strong>Sanity</strong>, <strong>Stripe</strong>, <strong>Clerk</strong>, and <strong>Resend</strong>.</p>

<!-- Badges -->
[![Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/Library-React-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/Type-System--TypeScript-blue.svg)](https://www.typescriptlang.org)

Table of Contents
- Overview
- Quick Start
- Environment
- Project Structure
- Development Tips
- Testing Webhooks
- Deployment
- Contributing
- License & Acknowledgements

Overview
--------

Sky-Pass is an end-to-end minimal booking experience: browse flights, create Stripe checkout sessions, persist bookings in Sanity, and send confirmation emails through Resend. Clerk integration is included for optional authentication.

Why this project?
- Clean example of modern full-stack Next.js (App Router) with payments and webhooks.
- Practical reference for integrating Stripe checkout, webhook handling, and transactional email flows.

Quick Start
-----------

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Create a .env.local file (see Environment section).

3. Run the dev server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open http://localhost:3000

Environment
-----------

Create a .env.local with values similar to the example below. Only set the providers you plan to use.

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (optional)
RESEND_API_KEY=key_...
RESEND_FROM_EMAIL="Sky-Pass <noreply@skypass.com>"

# Sanity (optional)
SANITY_PROJECT_ID=yourProjectId
SANITY_DATASET=production
SANITY_API_TOKEN=sk...

# Clerk (optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_...
```

Note: Never check secrets into source control.

Project Structure
-----------------

- src/app - Next.js routes and API routes
  - api/checkout/route.ts — Create Stripe checkout sessions
  - api/webhooks/stripe/route.ts — Stripe webhook handler
- src/components — Reusable UI components (Navbar, Footer)
- src/lib — Server-side helpers (booking, pricing, email)
- src/sanity — Sanity schemas and helpers (if present)

Key files
- src/lib/booking.ts — session creation, pricing, persistence logic
- src/lib/email.ts — Resend email template and send helper

Development Tips
----------------

- Linting: `npm run lint` (ESLint)
- Formatting: follow project's TypeScript and Tailwind conventions
- Authentication: Clerk is optional — code falls back to `guest` if no user is present

Testing Webhooks Locally
-----------------------

Use the Stripe CLI to forward webhook events to your local server:

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli

2. Listen and forward to your local webhook endpoint:

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

3. Trigger a sample completed checkout session (use this for local testing):

```bash
stripe trigger checkout.session.completed
```

This will post a test event to your webhook route and exercise booking persistence and email sending (if Resend is configured).

Stripe Webhook Notes
- The webhook route verifies signature using STRIPE_WEBHOOK_SECRET. Add the webhook in the Stripe dashboard pointing to your deployed endpoint or use the Stripe CLI as above.

Deployment
----------

Recommended: Vercel (native Next.js support). Steps:

1. Push branch to a Git provider (GitHub).
2. Create a Vercel project and connect the repository.
3. Add environment variables in Vercel (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, SANITY_API_TOKEN, CLERK keys, etc.).
4. Configure Stripe webhook to point to https://your-deployment-url/api/webhooks/stripe and copy its signing secret into STRIPE_WEBHOOK_SECRET in Vercel.

For production, consider:
- Using a durable store for webhook deduplication (Redis or DB) instead of in-memory Set.
- Implementing seat hold / reservation windows to prevent oversells.

Contributing
------------

1. Fork the repo and create a feature branch.
2. Keep changes small and focused.
3. Open a pull request describing the change and link to related issues.

If you'd like, I can add a CONTRIBUTING.md with a PR template and checklist.

License
-------

No license file is included in this repository. Add a LICENSE file to open-source.

Acknowledgements
----------------

Built with Next.js, Sanity, Stripe, Clerk, and Resend.

What's next?
- I can add project-specific badges (CI, coverage), embed screenshots or a demo GIF, or create a CONTRIBUTING.md and PR template. Tell me which you'd like.
