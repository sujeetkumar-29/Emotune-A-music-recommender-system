# 🎵 EmoTune — Emotion-Based Music Recommender

<p align="center">
  <strong>Feel it. Hear it.</strong><br>
  A full-stack AI music recommendation system that detects facial emotions and recommends music that matches your mood.
</p>

<p align="center">
  <a href="https://github.com/sujeetkumar-29/Emotune-A-music-recommender-system">GitHub Repository</a>
</p>

---

## 📌 Overview

**EmoTune** is a full-stack AI-powered music recommendation platform that uses facial emotion recognition to understand a user's current mood and generate personalized YouTube music recommendations.

The application supports both **real-time webcam detection** and **image upload**. After detecting an emotion, the backend uses the detected mood to query the **YouTube Data API v3** and returns relevant music recommendations.

The project combines:

- 🤖 Facial emotion recognition with TensorFlow/Keras
- 🧠 Custom ML preprocessing and inference
- ⚡ FastAPI REST APIs
- 🗄️ MongoDB with Beanie ODM
- 🔐 JWT authentication and Google OAuth
- 🎶 YouTube Data API v3
- ⚛️ React + Vite frontend
- 🎨 Tailwind CSS
- 📊 Emotion history and analytics
- ❤️ Favorite songs
- 🌓 Dark/light theme support

---

## ✨ Features

### 🤖 AI & Emotion Detection

- Real-time facial emotion detection through webcam
- Emotion detection from uploaded images
- Face detection and cropping using OpenCV
- Keras `.keras` model loaded once during backend startup
- Automatic handling of the model's input shape and image channels
- Largest detected face is selected when multiple faces are present
- Emotion probability/confidence information returned to the frontend

### 🎶 Music Recommendation

- Maps detected emotions to music-search queries
- Uses YouTube Data API v3 for recommendations
- Displays recommended tracks in the application
- Integrated YouTube player
- Save favorite songs for later

### 🔐 Authentication

- Email/password registration and login
- JWT access and refresh tokens
- Email verification flow
- Forgot-password and reset-password flow
- Google OAuth 2.0 login
- Protected application routes
- Automatic access-token refresh after authentication failures

### 📊 User Dashboard

- Recent emotion activity
- Mood-over-time visualization
- Detection history
- Emotion filtering
- Favorite songs
- User profile
- Dark/light theme

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │ Webcam / Image       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React + Vite         │
                    │ Frontend             │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │ FastAPI Backend      │
                    └───────┬───────┬──────┘
                            │       │
                ┌───────────┘       └───────────────┐
                ▼                                   ▼
       ┌─────────────────┐                  ┌─────────────────┐
       │ TensorFlow /    │                  │ MongoDB +       │
       │ Keras + OpenCV  │                  │ Beanie ODM      │
       │ Emotion Model   │                  │ Users/History/  │
       └────────┬────────┘                  │ Favorites       │
                │                           └─────────────────┘
                │ Detected Emotion
                ▼
       ┌─────────────────────┐
       │ YouTube Data API v3 │
       └──────────┬──────────┘
                  │
                  ▼
       ┌─────────────────────┐
       │ Music Recommendations│
       │ + YouTube Player     │
       └─────────────────────┘
```

---

## 🔄 How EmoTune Works

1. The user signs in or creates an account.
2. The user chooses **Live Detection** or **Upload Detection**.
3. The frontend captures a webcam frame or uploaded image.
4. The image is sent to the FastAPI backend.
5. OpenCV detects and crops the largest face.
6. The TensorFlow/Keras model preprocesses the face and predicts the emotion.
7. The detected emotion is stored in the user's history.
8. The backend converts the emotion into a music-search query.
9. YouTube Data API v3 returns relevant music results.
10. The frontend displays the recommendations.
11. The user can play tracks and save favorites.

---

## 🎭 Supported Emotions

EmoTune is designed around seven emotion categories:

| Emotion | Example Use Case |
|---|---|
| 😊 Happy | Energetic or cheerful music |
| 😢 Sad | Calm or mood-supporting music |
| 😠 Angry | High-energy or intense music |
| 😲 Surprise | Exciting and unexpected music |
| 😨 Fear | Calming or relaxing music |
| 🤢 Disgust | Mood-shifting recommendations |
| 😐 Neutral | Balanced/general recommendations |

> The recommendations are generated from the detected emotion and the configured YouTube search strategy.

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Python** | Backend and ML ecosystem |
| **FastAPI** | REST API framework |
| **TensorFlow / Keras** | Facial emotion recognition |
| **OpenCV** | Face detection and image processing |
| **MongoDB** | Persistent database |
| **Beanie ODM** | MongoDB object/document modeling |
| **JWT** | Access and refresh-token authentication |
| **Authlib** | Google OAuth integration |
| **YouTube Data API v3** | Music recommendations |
| **Uvicorn** | ASGI application server |

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | User interface |
| **Vite** | Frontend build tooling |
| **Tailwind CSS v4** | Styling |
| **React Router** | Client-side routing |
| **TanStack Query** | Server-state management |
| **Zustand** | Client-state management |
| **Axios** | HTTP requests |
| **Framer Motion** | Animations |
| **Recharts** | Mood analytics |
| **Lucide React** | Icons |
| **react-webcam** | Webcam capture |

---

## 📂 Project Structure

```text
Emotune-A-music-recommender-system/
│
├── emotune-backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── emotion.py
│   │   │   ├── favorites.py
│   │   │   ├── history.py
│   │   │   ├── music.py
│   │   │   └── users.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── oauth.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   └── session.py
│   │   │
│   │   ├── ml/
│   │   │   ├── custom_layers.py
│   │   │   ├── face_detect.py
│   │   │   ├── model_loader.py
│   │   │   └── predict.py
│   │   │
│   │   ├── models/
│   │   │   ├── detection_history.py
│   │   │   ├── favorite.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   └── services/
│   │       └── youtube_service.py
│   │
│   ├── ml_models/
│   │   └── best_fer_model.keras
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── emotune-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Python 3.10+
- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas
- Google Cloud project for OAuth and YouTube Data API
- A trained Keras emotion-recognition model

---

## 1. Clone the Repository

```bash
git clone https://github.com/sujeetkumar-29/Emotune-A-music-recommender-system.git
cd Emotune-A-music-recommender-system
```

---

## 2. Backend Setup

```bash
cd emotune-backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

```bash
copy .env.example .env
```

For macOS/Linux:

```bash
cp .env.example .env
```

Configure the variables in `.env`.

### Minimum Configuration

```env
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=emotune

JWT_SECRET_KEY=your-long-random-secret
JWT_ALGORITHM=HS256

MODEL_PATH=./ml_models/best_fer_model.keras

FRONTEND_URL=http://localhost:5173
```

### Optional Services

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

YOUTUBE_API_KEY=

REDIS_URL=redis://localhost:6379/0
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

---

## 3. Frontend Setup

Open a new terminal:

```bash
cd emotune-frontend
npm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

For a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🔑 Google OAuth Setup

1. Open Google Cloud Console.
2. Create or select a project.
3. Configure an OAuth 2.0 Web Application client.
4. Add the backend callback URL:

```text
http://localhost:8000/auth/google/callback
```

5. Enable **YouTube Data API v3**.
6. Add the required credentials to the backend `.env`.
7. Make sure the frontend and backend URLs match your configuration.

---

## 🔌 API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/google
GET  /auth/google/callback
```

### User

```text
GET /users/me
PUT /users/me
```

### Emotion Detection

```text
POST /detect/live
POST /detect/upload
```

### Music

```text
GET /music/recommend
```

### History

```text
GET    /history
DELETE /history
DELETE /history/{id}
```

### Favorites

```text
GET    /favorites
POST   /favorites
DELETE /favorites/{id}
```

For the complete interactive API reference, run the backend and open:

```text
http://localhost:8000/docs
```

---

## 🧠 Machine Learning Pipeline

```text
Image / Webcam Frame
        │
        ▼
   Face Detection
        │
        ▼
   Face Cropping
        │
        ▼
 Image Preprocessing
        │
        ▼
Keras Emotion Model
        │
        ▼
Emotion Probabilities
        │
        ▼
Detected Emotion
        │
        ▼
YouTube Search Query
        │
        ▼
Music Recommendations
```

The backend loads the Keras model during application startup rather than loading it for every request. This avoids repeated model-loading overhead during inference.

The model preprocessing adapts to the model's configured input shape, including grayscale/RGB and resolution differences.

---

## 🔐 Security Considerations

The project implements:

- JWT-based authentication
- Separate access and refresh tokens
- Password hashing
- Protected API routes
- Google OAuth authentication
- Email verification
- Password reset tokens
- Environment variables for secrets
- CORS configuration
- Optional Redis integration for rate limiting/token-related features

### Production Recommendation

For production deployment, consider moving authentication tokens from browser `localStorage` to secure **httpOnly cookies**, enabling HTTPS, rotating secrets, restricting CORS origins, and adding appropriate rate limiting.

---

## 🧪 Testing

### Backend

```bash
cd emotune-backend
pytest
```

### Frontend

The frontend currently provides a build/lint workflow through its npm scripts:

```bash
npm run build
npm run lint
```

---

## 🐳 Docker

The backend includes a `Dockerfile`.

Build the backend image:

```bash
cd emotune-backend

docker build -t emotune-backend .
```

Run it with your required environment configuration:

```bash
docker run --env-file .env -p 8000:8000 emotune-backend
```

---

## 📸 Screenshots

Add screenshots here to showcase the project:

```text
docs/
├── landing-page.png
├── dashboard.png
├── live-detection.png
├── upload-detection.png
├── history.png
└── favorites.png
```

Example Markdown:

```md
![Dashboard](docs/dashboard.png)
```

---

## 🗺️ Roadmap

- [ ] Complete end-to-end Google OAuth testing
- [ ] Complete integrated webcam → emotion → recommendation testing
- [ ] Production deployment
- [ ] Spotify integration as an alternative music provider
- [ ] Mobile-responsive PWA support
- [ ] WebSocket-based continuous emotion detection
- [ ] Avatar upload and storage
- [ ] Admin dashboard
- [ ] Route-level frontend code splitting
- [ ] Production-grade cookie-based authentication

---

## 💡 Key Engineering Highlights

### 1. Full-Stack AI Integration

Connects a machine-learning inference pipeline with a production-style REST API and modern React frontend.

### 2. Efficient Model Loading

The emotion model is loaded once during application startup instead of being reloaded for every request.

### 3. Adaptive Image Preprocessing

The backend checks the model's input shape and adapts preprocessing instead of assuming a single fixed input format.

### 4. Token Refresh Flow

The frontend Axios client automatically attempts a refresh-token flow after an unauthorized response before retrying the original request.

### 5. Modular Backend Architecture

The backend separates API routes, database models, schemas, ML logic, authentication/security, and external services.

### 6. Persistent User Experience

Emotion history and favorite songs are stored so users can revisit their activity and saved recommendations.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 📄 License

This project is distributed under the **MIT License**.

---

## 👨‍💻 Author

**Sujeet Kumar**

GitHub:  
https://github.com/sujeetkumar-29

Project:  
https://github.com/sujeetkumar-29/Emotune-A-music-recommender-system

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
