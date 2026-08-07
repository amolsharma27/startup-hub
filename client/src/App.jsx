import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PublicLayout from './components/PublicLayout';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StartupsPage from './pages/StartupsPage';
import StartupDetailsPage from './pages/StartupDetailsPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
import TasksPage from './pages/TasksPage';
import MentorshipPage from './pages/MentorshipPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import { getAuthToken, clearAuthToken } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  return token ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen dark:bg-[#0a0f1e] light:bg-[#F8FAFC] transition-colors duration-300">
      {/* Ambient glow — dark mode only */}
      <div className="dark:block light:hidden fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ background: 'rgba(37,99,235,0.04)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float" style={{ background: 'rgba(20,184,166,0.03)', animationDelay: '1.5s' }} />
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  </>
);

function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  // Restore logged-in user from token on app mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          else clearAuthToken();
        })
        .catch(() => clearAuthToken());
    }
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
        <Route path="/testimonials" element={<PublicLayout><TestimonialsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/login" element={<LoginPage setUser={setUser} showToast={showToast} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} showToast={showToast} />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/startups" element={<ProtectedRoute><AppLayout><StartupsPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/startups/:id" element={<ProtectedRoute><AppLayout><StartupDetailsPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><AppLayout><UserProfilePage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><AppLayout><TasksPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><AppLayout><MentorshipPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AppLayout><ChatPage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;