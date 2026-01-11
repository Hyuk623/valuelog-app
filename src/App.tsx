import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { ChildrenPage } from './pages/children/ChildrenPage';
import { NewChildPage } from './pages/children/NewChildPage';
import { ExperienceDetailPage } from './pages/experiences/ExperienceDetailPage';
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

          <Route path="/experiences" element={<div />} />
          <Route path="/experiences/new" element={<div />} />
          <Route path="/experiences/:id" element={<ExperienceDetailPage />} />

          <Route path="/frameworks" element={<div />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/children" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
