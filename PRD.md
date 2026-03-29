Product Requirements Document (PRD)
=================================

Project: Sky-Pass
Author: (auto-generated draft)
Date: (update as needed)

1. Executive Summary
--------------------

Sky-Pass is a lightweight flight booking web application built with Next.js (App Router). It allows visitors to browse flights and destinations, create Stripe checkout sessions to pay for bookings, and receive confirmation emails after successful payment. Bookings and flights are persisted in Sanity CMS. Clerk is used for optional authentication and Resend is used for transactional emails.

This PRD describes product goals, user personas, user flows, functional and non-functional requirements, data model, API contract, acceptance criteria, milestones, and operational requirements.

2. Goals and Success Metrics
----------------------------

Primary goals
- Enable users to search and browse flights.
- Let users complete a paid booking using Stripe checkout.
- Persist bookings reliably and send confirmation emails.

Success metrics
- Conversion rate: percentage of initiated checkouts that complete payment (target 10%+ for early MVP).
- Email deliverability: 95% successful sends for Resend-sent confirmations.
- Error rate: less than 1% server errors on checkout and webhook endpoints (measured per week).
- Data integrity: bookings persisted and seat counts updated for 100% of completed payments (excluding transient failures).

3. Personas
-----------

- Traveler (Primary): Searches flights, books a seat, expects clear booking confirmation and email.
- Admin / Ops (Secondary): Manages flight data in Sanity and monitors bookings and webhook processing.
- Developer (Internal): Runs the app locally, integrates Stripe/Resend/Sanity/Clerk, debugs webhook processing.

4. Key User Stories
-------------------

1. As a Traveler, I want to browse available flights so that I can find an option that fits my schedule.
2. As a Traveler, I want to enter passenger details and open a secure Stripe checkout in order to pay for the booking.
3. As a Traveler, I want to receive a booking confirmation email after my payment completes so I have proof of purchase.
4. As an Admin, I want bookings to be stored in Sanity and flight seat counts decremented after successful payment so inventory stays accurate.
5. As a Developer, I want clear API behavior for checkout creation and webhooks so I can test and integrate reliably.

5. Features (MVP)
-----------------

- Flight listings and pages (origin, destination, departure time, price, seats available).
- Booking flow that collects passenger details and number of passengers.
- Server-side creation of Stripe Checkout sessions with idempotency protection.
- Stripe webhook handler that verifies signatures, persists completed bookings, decrements seat availability, and triggers confirmation emails via Resend.
- Optional Clerk integration to associate bookings to authenticated users.
- Admin content management via Sanity for flights and static content.

6. Functional Requirements
--------------------------

FR-1. Browse Flights
- The site must display a list of flights with essential metadata (flightNumber, airlineName, origin, destination, departureTime, priceInCents, seatsAvailable).

FR-2. Create Checkout Session
- Endpoint: POST /api/checkout
- Request: JSON { flightId, passengers, passenger: { firstName, lastName, email, phone?, passportNumber? } }
- Behavior: Validate inputs, compute dynamic price (surcharges), create Stripe checkout session with metadata and idempotency key, return session.url.

FR-3. Stripe Webhooks
- Endpoint: POST /api/webhooks/stripe
- Behavior: Validate webhook signature using STRIPE_WEBHOOK_SECRET, ignore duplicate events, on checkout.session.completed persist booking object to Sanity, decrement seatsAvailable, and send confirmation email (Resend) when passenger email is present.

FR-4. Booking Persistence
- Booking stored in Sanity with a stable id: booking.<stripeSessionId>
- Booking fields include stripeSessionId, stripeEventId, bookingReference, flightId, userId, passengers, passenger object, totalPriceInCents, status, emailSent (boolean), createdAt

FR-5. Email Confirmation
- Uses Resend API to send an HTML email with booking details. If Resend is not configured, email sending is skipped but booking still persists.

FR-6. Authentication (optional)
- If Clerk is configured, API endpoints should map authenticated userId; otherwise use "guest".

7. Non-functional Requirements
-----------------------------

- Security: Stripe webhook signatures must be verified. All secrets stored as environment variables (never checked into source).
- Availability: Checkout and webhook endpoints must be reachable by Stripe. Target 99.9% uptime for API endpoints.
- Scalability: Webhook handler must be idempotent and safe for repeated events. Use deduplication (in-memory set is fine for single-instance testing; for production use a durable store or Stripe event metadata checks).
- Performance: Checkout session creation should respond within 1s on average under normal load.

8. Data Model
-------------

Flight (Sanity document)
- _id: string
- _type: "flight"
- flightNumber: string
- airlineName: string
- origin: string
- destination: string
- departureTime: ISO string
- priceInCents: number
- seatsAvailable: number

Booking (Sanity document)
- _id: booking.<stripeSessionId>
- _type: "booking"
- stripeSessionId: string
- stripeEventId: string
- bookingReference: string (SP-XXXXXXXX)
- flightId: string (foreign key to Flight)
- userId: string (Clerk id or "guest")
- passengers: number
- passenger: { firstName, lastName, email, phone, passportNumber }
- totalPriceInCents: number
- status: string (e.g., paid)
- emailSent: boolean
- createdAt: ISO string

9. API Contract
---------------

POST /api/checkout
- Request JSON:
  {
    "flightId": "<flight id>",
    "passengers": 2,
    "passenger": { "firstName":"Alice","lastName":"Smith","email":"alice@example.com" }
  }
- Response JSON success: { "url": "https://checkout.stripe.com/..." }
- Error response: { "error": "message" }, status 4xx/5xx

POST /api/webhooks/stripe
- Stripe will POST raw request body and set header stripe-signature
- Handler must verify signature using STRIPE_WEBHOOK_SECRET
- On checkout.session.completed, respond 200 with { received: true }

10. UI Flow and Wireframes (text)
---------------------------------

1. Home / Flights list
  - Top navigation and search/filter controls.
  - List of cards listing flight basic info and price.

2. Flight detail
  - Shows flight metadata, available seats, price, select number of passengers, "Book" button.

3. Booking form
  - Collect passenger name, email, phone, passportNumber (optional)
  - Submit creates checkout session and redirects user to Stripe checkout URL.

4. Success page
  - After payment, Stripe redirects to /booking/success?session_id=<id>
  - Success page shows bookingReference and next steps.

11. Edge Cases and Error Handling
--------------------------------

- Missing or invalid env variables: Return clear server error on startup or when endpoints require them (e.g., 'Stripe not configured').
- Duplicate webhook events: Use deduplication to ignore duplicates (current code uses in-memory Set processedEvents; note: ephemeral across process restarts).
- Failed email sends: Log and leave booking.emailSent as false; do not retry indefinitely. Implement limited retry.
- Insufficient seats at checkout creation: Validate and return 400.

12. Security & Compliance
------------------------

- PCI: Stripe Checkout reduces PCI burden as card handling is done by Stripe. Do not log card data.
- Webhook signing: Verify Stripe event signatures using STRIPE_WEBHOOK_SECRET.
- Secrets: Keep STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, SANITY API token, and Clerk secret keys in environment variables.

13. Operational Requirements
---------------------------

Environment variables (recommended list)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- SANITY_PROJECT_ID
- SANITY_DATASET
- SANITY_API_TOKEN (server-side, if required)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY

Local developer checklist
- Create .env.local with required keys
- npm install
- npm run dev
- Use Stripe CLI for webhook testing: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe` and then `stripe trigger checkout.session.completed` with sample session data.

Monitoring & Alerts
- Capture server error logs for /api/checkout and /api/webhooks/stripe.
- Monitor failed email sends and persist failures for investigation.
- Track booking creation rates and webhook processing latencies.

Backups & Data retention
- Sanity is the primary datastore for flights and bookings; follow Sanity backup and export practices for long term retention.

14. Acceptance Criteria
----------------------

AC-1: Browse flights and view flight details.
AC-2: Visitor can create a checkout session for an available flight and receive a valid Stripe checkout URL.
AC-3: On simulated Stripe checkout.session.completed, the system persists a booking document and decrements seatsAvailable accordingly.
AC-4: When RESEND_API_KEY is configured, the booking confirmation email is sent and emailSent is set to true.
AC-5: Webhook endpoint rejects invalid signatures and returns 400.

15. Roadmap & Milestones
------------------------

MVP (current):
- Browse flights, create checkout sessions, webhook handling, persist bookings, send confirmation emails.

Post-MVP (improvements):
- Durable webhook event deduplication (use database or Redis).
- Admin dashboard for viewing and managing bookings.
- Automated tests for checkout and webhook flows.
- Support multi-currency and price promotions.
- Seat hold / reservation window to avoid oversell during checkout time.

16. Risks & Mitigations
----------------------

- Risk: In-memory deduplication loses state when process restarts leading to duplicate processing.

- Risk: Email deliverability issues.

- Risk: Oversell when concurrent checkouts occur.

17. Open Questions
------------------

- Is Clerk required for MVP or optional? Current code supports optional usage (falls back to "guest").
- Should we implement a seat hold/reservation window to avoid oversells? Currently the system only decrements seats after successful payment.
- What are production-grade requirements for webhook deduplication and ordering? Use durable store or rely on Stripe idempotency?

18. Appendix
------------

Key files and locations
- src/app/api/checkout/route.ts — checkout creation endpoint
- src/app/api/webhooks/stripe/route.ts — webhook handler
- src/lib/booking.ts — pricing and Stripe session creation; booking persistence
- src/lib/email.ts — Resend integration and email template
- src/components — UI components (Navbar, Footer, etc.)

Suggested next actions
----------------------
1. Review and approve this PRD with stakeholders.
2. Add missing environment variables to the project documentation and CI/CD secrets store.
3. Implement production-grade webhook deduplication and seat hold if required by business rules.
4. Add automated tests that simulate Stripe checkout and webhook processing.

End of document.
