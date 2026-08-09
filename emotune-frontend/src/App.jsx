import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import YouTubePlayer from "./components/YouTubePlayer";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Landing from "./pages/Landing";
import LiveDetect from "./pages/LiveDetect";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OAuthCallback from "./pages/OAuthCallback";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import UploadDetect from "./pages/UploadDetect";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/detect/live" element={<LiveDetect />} />
            <Route path="/detect/upload" element={<UploadDetect />} />
            <Route path="/history" element={<History />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <YouTubePlayer />
    </div>
  );
}
