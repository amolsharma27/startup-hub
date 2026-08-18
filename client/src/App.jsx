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
import ProfilesPage from './pages/ProfilesPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
import TasksPage from './pages/TasksPage';
import MentorshipPage from './pages/MentorshipPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import { getAuthToken, clearAuthToken } from './utils/auth';
import { api } from './services/api';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  return token ? children : <Navigate to="/login" replace />;
};

// Redirects admin users away from regular user routes (only after user is loaded)
const UserRoute = ({ children, user }) => {
  if (user && user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen dark:bg-[#0a0a0a] light:bg-[#FAFAFA] transition-colors duration-300">
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
      api.get('/auth/me')
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
        <Route path="/dashboard" element={<ProtectedRoute><UserRoute user={user}><AppLayout><DashboardPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/startups" element={<ProtectedRoute><UserRoute user={user}><AppLayout><StartupsPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/startups/:id" element={<ProtectedRoute><UserRoute user={user}><AppLayout><StartupDetailsPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/profiles" element={<ProtectedRoute><UserRoute user={user}><AppLayout><ProfilesPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserRoute user={user}><AppLayout><ProfilePage showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><AppLayout><UserProfilePage user={user} showToast={showToast} /></AppLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage user={user} showToast={showToast} /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><UserRoute user={user}><AppLayout><TasksPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><UserRoute user={user}><AppLayout><MentorshipPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><UserRoute user={user}><AppLayout><NotificationsPage showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><UserRoute user={user}><AppLayout><ChatPage user={user} showToast={showToast} /></AppLayout></UserRoute></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;