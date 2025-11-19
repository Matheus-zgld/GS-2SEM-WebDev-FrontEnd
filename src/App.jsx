import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SeedInitializer from './components/SeedInitializer';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Network from './pages/app/Network';
import Discovery from './pages/app/Discovery';
import Marketplace from './pages/app/Marketplace';
import Workspace from './pages/app/Workspace';
import Applications from './pages/app/Applications';
import PublisherApplications from './pages/app/PublisherApplications';
import SearchResults from './pages/app/SearchResults';
import ChallengeDetail from './pages/app/ChallengeDetail';
import Community from './pages/app/Community';
import Skills from './pages/app/Skills';
import Planner from './pages/app/Planner';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SeedInitializer />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/seed" element={<Admin />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/app/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/app/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
          <Route path="/app/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/app/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/app/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/app/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/app/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
          <Route path="/app/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/app/publisher" element={<ProtectedRoute><PublisherApplications /></ProtectedRoute>} />
          <Route path="/app/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/app/challenge/:id" element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;