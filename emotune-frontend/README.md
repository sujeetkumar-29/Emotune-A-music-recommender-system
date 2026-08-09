# Emotune — Frontend

React (Vite) frontend for the Emotune facial-emotion music recommender.

## Quick start

```bash
cd emotune-frontend
npm install
cp .env.example .env      # point VITE_API_BASE_URL at your backend
npm run dev
```

Runs at **http://localhost:5173** by default. Requires the backend
(`emotune-backend`) running and reachable at the URL in `.env`.

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

## Stack

- **React 19 + Vite** — plain JSX, no TypeScript
- **Tailwind CSS v4** (CSS-first config via `@theme` in `src/index.css`, no `tailwind.config.js` needed)
- **Framer Motion** — page/element transitions
- **React Router v6** — routing, including a `ProtectedRoute` guard
- **TanStack Query v5** — server state (history, favorites, profile, detection)
- **Zustand** — client state: `authStore` (persisted tokens/user), `playerStore`
  (currently playing track), `themeStore` (dark/light, synced to `<html class="dark">`)
- **Recharts** — mood-over-time line chart
- **lucide-react** — icons
- **Axios** — API client with automatic access-token header + silent
  refresh-token retry on 401

## Design system

Tokens live in `src/index.css` under `@theme`:

- **Brand**: `brand-*` (amethyst/indigo) — primary actions, links
- **Ember**: `ember-*` (warm orange) — used sparingly for CTA gradients and the
  signature waveform's second gradient stop
- **Ink / Mist**: dark-mode and light-mode neutrals
- **Emotion palette**: `emotion-happy` / `sad` / `angry` / `surprise` / `fear`
  / `disgust` / `neutral` — a distinct semantic palette used only for emotion
  tags, chart lines, and result cards, never for brand chrome
- **Type**: Space Grotesk (display/headings), Inter (body), IBM Plex Mono
  (timestamps, confidence percentages)
- **Signature element**: the gradient equalizer bars (`<Waveform />`), reused
  in the nav logo, hero, loading states, and empty states

Dark mode toggles via a `.dark` class on `<html>` (Tailwind v4's
`@custom-variant dark`), controlled by `themeStore` and persisted to
`localStorage`.

## Project layout

```
src/
├── main.jsx                 # entry: QueryClientProvider + BrowserRouter
├── App.jsx                  # route table, Navbar/Player shell
├── index.css                 # Tailwind v4 import + @theme design tokens
├── api/
│   ├── client.js             # axios instance, auth header, refresh-on-401
│   ├── auth.js                register/login/verify/forgot/reset/google-url
│   └── resources.js           users, detect, music, history, favorites
├── store/
│   ├── authStore.js           persisted tokens + user profile (zustand)
│   ├── playerStore.js         current track / queue / play state
│   └── themeStore.js          dark/light, synced to <html>
├── hooks/
│   ├── useAuth.js             login/register mutations + /users/me query
│   ├── useCamera.js           getUserMedia wrapper, frame capture -> base64
│   └── useEmotionDetect.js    detect (live/upload) -> auto-fetch recommendations
├── lib/
│   └── emotions.js            emotion -> {label, color, emoji} metadata
├── components/
│   ├── Navbar.jsx             responsive, auth-aware, theme toggle
│   ├── EmotionResultCard.jsx  detected emotion + probability breakdown
│   ├── SongCard.jsx           track thumbnail, play, favorite toggle
│   ├── YouTubePlayer.jsx      sticky bottom embedded IFrame player
│   ├── MoodChart.jsx          mood-over-time line chart (recharts)
│   ├── FAQAccordion.jsx
│   ├── Waveform.jsx           signature animated equalizer element
│   ├── ProtectedRoute.jsx     redirects unauthenticated users to /login
│   └── Shared.jsx             Spinner, Footer
└── pages/
    ├── Landing.jsx             hero, how-it-works, features, FAQ, CTA
    ├── Login.jsx / Signup.jsx  email+password, "Continue with Google"
    ├── OAuthCallback.jsx       reads tokens from the Google redirect
    ├── VerifyEmail.jsx / ForgotPassword.jsx / ResetPassword.jsx
    ├── Dashboard.jsx           quick actions, mood chart, recent activity
    ├── LiveDetect.jsx          webcam capture -> result -> recommendations
    ├── UploadDetect.jsx        drag-and-drop -> result -> recommendations
    ├── History.jsx             paginated timeline, emotion filter, chart
    ├── Favorites.jsx           saved tracks grid
    ├── Profile.jsx             name, theme, verification status
    └── NotFound.jsx
```

## Auth flow notes

- Access + refresh tokens are stored in `authStore` (persisted to
  `localStorage` via zustand's `persist` middleware — see the note below on
  swapping this for httpOnly cookies in production).
- `client.js` attaches `Authorization: Bearer <access_token>` to every
  request and, on a 401, makes a single silent call to `/auth/refresh`
  before retrying the original request once. If that also fails, it logs
  the user out.
- Google OAuth: the "Continue with Google" link sends the browser directly
  to the backend's `/auth/google` (full page redirect, not an API call).
  The backend redirects back to `/oauth-callback?access_token=...&refresh_token=...`,
  which `OAuthCallback.jsx` reads and stores before routing to `/dashboard`.

**Production note:** the spec calls for httpOnly cookies over localStorage
for token storage. This build uses localStorage (via zustand `persist`) for
simplicity in local dev; swapping to httpOnly cookies means moving refresh
to a cookie-based flow on the backend and dropping `setTokens`/`persist`
here — flagged rather than silently done, since it's a real security
trade-off for a production deployment.

## Known gaps (see backend README's "not included yet" too)

- No avatar upload UI (backend doesn't have the storage endpoint either)
- No WebSocket-based continuous live detection — capture is click-to-detect
- Bundle isn't code-split yet (single ~850KB JS chunk) — fine for this
  stage, but worth revisiting with `React.lazy()` per route before a real
  deploy
