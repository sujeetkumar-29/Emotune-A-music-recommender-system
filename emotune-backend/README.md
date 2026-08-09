# Emotune — Backend

FastAPI backend for the Emotune facial-emotion music recommender.

## Quick start (local dev)

```bash
cd emotune-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in the values (see below)

# Drop your trained model at ml_models/best_fer_model.keras
# (or update MODEL_PATH in .env to point elsewhere)

uvicorn app.main:app --reload
```

API docs (Swagger UI) will be at **http://localhost:8000/docs** once running.

## Requirements

- MongoDB running locally or an Atlas connection string (`DATABASE_URL`)
- A trained Keras FER model file (`.keras` or `.h5`) — the app auto-detects its
  input size/channels from `model.input_shape`, so 48x48 grayscale (classic
  FER2013-style) or RGB models both work out of the box
- (Optional) YouTube Data API v3 key for `/music/recommend`
- (Optional) Google OAuth client ID/secret for `/auth/google`
- (Optional) SMTP credentials for verification/reset emails — if
  `MAIL_USERNAME` is left blank, emails are logged instead of sent, which is
  convenient for local dev

## Environment variables

See `.env.example` for the full list with comments. Minimum to boot the app
with just email/password auth and no music/email features:

```
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=emotune
JWT_SECRET_KEY=some-long-random-string
MODEL_PATH=./ml_models/best_fer_model.keras
```

## Project layout

```
app/
├── main.py                 # FastAPI app, lifespan (DB init + model load), routers
├── core/
│   ├── config.py           # pydantic-settings, reads .env
│   ├── security.py         # JWT issue/verify, password hashing, get_current_user dep
│   └── oauth.py            # Authlib Google OAuth client registration
├── models/                 # Beanie documents (User, DetectionHistory, Favorite)
├── schemas/                # Pydantic request/response models
├── api/                    # Route modules, one per resource
│   ├── auth.py              /auth/register /auth/login /auth/refresh
│   │                        /auth/verify-email /auth/forgot-password /auth/reset-password
│   │                        /auth/google /auth/google/callback
│   ├── users.py             /users/me (GET, PUT)
│   ├── emotion.py           /detect/live  /detect/upload
│   ├── music.py              /music/recommend
│   ├── history.py           /history (GET, DELETE) /history/{id} (DELETE)
│   └── favorites.py         /favorites (GET, POST) /favorites/{id} (DELETE)
├── ml/
│   ├── model_loader.py      loads the .keras model + Haar cascade once at startup
│   ├── face_detect.py       OpenCV face detection/cropping
│   └── predict.py           preprocessing + inference, base64/file decoding
├── services/
│   ├── youtube_service.py   emotion -> search query -> YouTube Data API v3 call
│   └── email_service.py     fastapi-mail wrapper for verification/reset emails
└── db/
    └── session.py            Motor client + init_beanie()
```

## Notable design choices

- **Model loaded once**, in the `lifespan` startup handler — not per-request —
  to avoid multi-second reload latency on every `/detect` call.
- **Model input shape is auto-detected** (`model.input_shape`) so the
  preprocessing step adapts to grayscale vs RGB and to the resolution your
  specific model was trained on, instead of hardcoding 48x48x1.
- **Largest detected face wins** when a photo contains multiple faces — a
  reasonable default for a single-user webcam/selfie flow.
- Auth uses **short-lived access tokens + longer-lived refresh tokens**, both
  JWTs. Email verification and password reset also ride on JWTs with a
  distinct `type` claim (`verify_email` / `reset_password`) so they can't be
  reused as access tokens.
- Google OAuth account linking: if a Google login's email matches an existing
  email/password account, the accounts are linked (the existing user gets a
  `google_id`) rather than creating a duplicate user.

## Not included yet (see spec section 7)

Rate limiting on `/detect`, Redis token blacklist, WebSocket-based continuous
live detection, avatar file upload storage, and the admin dashboard are
intentionally left out of this first backend pass — flagged here so they're
easy to pick up next rather than silently missing.

## Next up

Frontend (React/Vite) build, per the original spec — landing page, auth
pages, live/upload detection pages, history, favorites, profile.
