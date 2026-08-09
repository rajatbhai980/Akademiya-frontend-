# Akademiya frontend spec notes

This file preserves the main implementation context for the Akademiya frontend so future AI work can understand the original intent without relying on the removed source bundle.

## Product context
- React + Vite frontend for an Akademiya MCQ gaming site.
- Focus areas: auth, gameplay, leaderboard, store, and admin tooling.

## Visual and UX expectations
- Palette is green + white, with Roboto typography.
- Theme tokens live in CSS variables so styling can be adjusted centrally.
- Buttons, cards, and inputs should have deliberate hover/active transitions.

## Authentication flow
- On app load, the auth provider should call:
  - GET /users/csrf/
  - GET /users/me/
- Login is a two-step OTP flow:
  - POST /users/otp_request/
  - POST /users/otp_verification/
- The axios client should attach X-CSRFToken from the csrftoken cookie and send withCredentials: true.

## Game flow
- Flow is:
  - GameSetup -> POST /game/start/
  - Redirect to /play/session/:sessionId
  - GamePlay fetches question pages and submits answers per page via POST /game/submit_answer/
  - On the last page, call POST /game/display_and_update_performance/ if authenticated
  - Show GameResults afterward

## Backend integration notes
- The user object from GET /users/me/ does not include gems/subscribed, so the store page should re-fetch profile details via GET /profiles/{pk}/.
- The admin tool’s page lookup/delete panel expects a numeric subject_id for GET /admintool/view_page/{year}/{subject_id}/.
- The backend should allow credentials from the frontend origin, including CORS_ALLOW_CREDENTIALS = True and the Vite dev origin in CORS_ALLOWED_ORIGINS.

## Delivery note
- The current workspace already contains the integrated frontend implementation, so the original source archive is no longer required for day-to-day work.
