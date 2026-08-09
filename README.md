# 🎵 EmoTune

**Feel it. Hear it.**
EmoTune detects your facial emotion in real time (via webcam or uploaded photo) and curates a YouTube music playlist to match — or shift — your mood.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Python](https://img.shields.io/badge/python-3.10-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🎭 **Real-time facial emotion detection** — live webcam feed or single-image upload, powered by a pre-trained TensorFlow/Keras CNN
- 🎶 **Mood-based music recommendations** — pulls curated tracks from YouTube Data API v3 based on the 7 detected emotions
- 🔐 **Secure authentication** — JWT access/refresh token flow, Google OAuth login, email verification & password reset via SendGrid
- 📊 **History & analytics** — track your emotional trends over time with interactive charts (Recharts)
- ❤️ **Favorites** — save songs you love for quick access later
- 🎨 **Polished UI** — amethyst/ember design system with a 7-color emotion palette and a signature animated equalizer waveform
- ⚡ **Modern, fast frontend** — React + Vite, Tailwind CSS v4, TanStack Query, Zustand, Framer Motion

---

## 🧠 Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **MongoDB + Beanie ODM** | Database & object modeling |
| **TensorFlow / Keras** | Facial emotion recognition model |
| **JWT** | Access & refresh token authentication |
| **Google OAuth 2.0** | Social login |
| **SendGrid** | Transactional email (verification, password reset) |
| **YouTube Data API v3** | Music recommendation source |

### Frontend
| Tech | Purpose |
|---|---|
| **React + Vite** | UI framework & build tooling |
| **Tailwind CSS v4** | Styling |
| **TanStack Query v5** | Server state management |
| **Zustand** | Client state management |
| **Framer Motion** | Animations |
| **Recharts** | Data visualization |

---

## 📸 Screenshots

> _Add screenshots or a demo GIF here once the UI is finalized._

| Dashboard | Live Detection | History |
|---|---|---|
| ![dashboard](docs/screenshots/dashboard.png) | ![live](docs/screenshots/live-detection.png) | ![history](docs/screenshots/history.png) |

---

## 🗂️ Project Structure

```
emotune/
├── emotune-backend/
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   ├── core/             # Config, security, JWT logic
│   │   ├── models/           # Beanie document models
│   │   ├── services/         # Emotion detection, YouTube, email services
│   │   └── main.py
│   ├── ml_models/            # Pre-trained .keras emotion model
│   ├── requirements.txt
│   └── .env.example
│
├── emotune-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/            # Landing, Login, Signup, Dashboard, etc.
│   │   ├── stores/           # Zustand stores
│   │   ├── hooks/
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10**
- **Node.js 18+**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google Cloud Console** project with OAuth 2.0 client + YouTube Data API v3 enabled
- **SendGrid** account for transactional email

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/emotune.git
cd emotune
```

### 2. Backend setup

```bash
cd emotune-backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in `emotune-backend/`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_REFRESH_SECRET_KEY=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
YOUTUBE_API_KEY=your_youtube_data_api_key
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

> ⚠️ **Note:** `bcrypt` must be pinned to `4.0.1` in `requirements.txt` — newer versions break `passlib` password hashing.

### 3. Frontend setup

```bash
cd emotune-frontend
npm install
```

Create a `.env` file in `emotune-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback` (backend callback)
4. Enable the **YouTube Data API v3** under **APIs & Services → Library**
5. Copy your Client ID & Secret into the backend `.env`

---

## 🧩 Key Architecture Notes

- The emotion recognition model is loaded lazily at startup (`import keras` directly, not `tf.keras`) to avoid TensorFlow 2.16+'s lazy-loading proxy issues.
- The model uses a custom squeeze-and-excitation channel-attention block; if you swap in your own `.keras` model, inspect its `model.weights.h5` (via `h5py`) to confirm layer names/shapes match your custom layer implementation.
- Auth uses short-lived JWT access tokens + longer-lived refresh tokens, with refresh rotation handled server-side.

---

## 🧪 Testing

```bash
# Backend
cd emotune-backend
pytest

# Frontend
cd emotune-frontend
npm run test
```

---

## 🗺️ Roadmap

- [ ] Finalize Google OAuth callback flow
- [ ] End-to-end auth flow testing (register, login, OAuth, email verification, password reset)
- [ ] Integrated testing of live webcam detection → YouTube recommendation pipeline
- [ ] Deploy backend (Render/Railway) and frontend (Vercel/Netlify)
- [ ] Add Spotify as an alternative music source
- [ ] Mobile-responsive PWA support

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- Pre-trained facial emotion recognition model architecture
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [FastAPI](https://fastapi.tiangolo.com/) & [Beanie ODM](https://beanie-odm.dev/)