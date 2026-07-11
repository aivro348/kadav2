import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SurveyorLayout from './layouts/SurveyorLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/SurveyList';
import NewSurvey from './pages/NewSurvey';
import ViewSurvey from './pages/ViewSurvey';
import Reports from './pages/Reports';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const username = sessionStorage.getItem('rws_username');
  
  if (!username) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const isAllowed = allowedRoles.includes(username) || (allowedRoles.includes('surveyor') && username.startsWith('iitk'));
    
    if (!isAllowed) {
      if (username === 'admin') return <Navigate to="/admin/dashboard" replace />;
      if (username.startsWith('iitk')) return <Navigate to="/surveyor" replace />;
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/:id" element={<ViewSurvey />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Surveyor Routes */}
        <Route path="/surveyor" element={
          <ProtectedRoute allowedRoles={['admin', 'surveyor']}>
            <SurveyorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="new" element={<NewSurvey />} />
          <Route path="surveys/:id" element={<ViewSurvey />} />
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
