import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { ChildrenPage } from './pages/children/ChildrenPage';
import { NewChildPage } from './pages/children/NewChildPage';
import { EditChildPage } from './pages/children/EditChildPage';
import { SupportPage } from './pages/support/SupportPage';
import { FrameworksPage } from './pages/frameworks/FrameworksPage';

// Experiences
import { ExperienceListPage } from './pages/experiences/ExperienceListPage';
import { NewExperiencePage } from './pages/experiences/NewExperiencePage';
import { EditExperiencePage } from './pages/experiences/EditExperiencePage';
import { ExperienceDetailPage } from './pages/experiences/ExperienceDetailPage';

// Stats
import { StatsPage } from './pages/stats/StatsPage';

import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/children" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Navigate to="/children" replace />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/children/new" element={<NewChildPage />} />
          <Route path="/children/:id/edit" element={<EditChildPage />} />

          <Route path="/experiences" element={<ExperienceListPage />} />
          <Route path="/experiences/new" element={<NewExperiencePage />} />
          <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
          <Route path="/experiences/:id/edit" element={<EditExperiencePage />} />

          <Route path="/frameworks" element={<FrameworksPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/children" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
