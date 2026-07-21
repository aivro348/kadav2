import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SurveyorLayout from './layouts/SurveyorLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/SurveyList';
import NewSurvey from './pages/NewSurvey';
import NewIrrigationSurvey from './pages/NewIrrigationSurvey';
import ViewSurvey from './pages/ViewSurvey';
import Reports from './pages/Reports';
import Landing from './pages/Landing';

import IrrigationDashboard from './pages/IrrigationDashboard';
import IrrigationSurveyList from './pages/IrrigationSurveyList';
import ViewIrrigationSurvey from './pages/ViewIrrigationSurvey';
import SurveySelection from './pages/SurveySelection';

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
        
        <Route path="/select-survey" element={
          <ProtectedRoute allowedRoles={['admin', 'surveyor']}>
            <SurveySelection />
          </ProtectedRoute>
        } />

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
          
          <Route path="dashboard-hnss" element={<IrrigationDashboard surveyType="hnss" />} />
          <Route path="surveys-hnss" element={<IrrigationSurveyList surveyType="hnss" />} />
          <Route path="dashboard-palar" element={<IrrigationDashboard surveyType="palar" />} />
          <Route path="surveys-palar" element={<IrrigationSurveyList surveyType="palar" />} />
          <Route path="survey/:id" element={<ViewIrrigationSurvey />} />
        </Route>

        {/* Surveyor Routes */}
        <Route path="/surveyor" element={
          <ProtectedRoute allowedRoles={['admin', 'surveyor']}>
            <SurveyorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SurveyList />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/:id" element={<ViewSurvey />} />
          <Route path="surveys-hnss" element={<IrrigationSurveyList surveyType="hnss" />} />
          <Route path="surveys-palar" element={<IrrigationSurveyList surveyType="palar" />} />
          <Route path="new" element={<NewSurvey />} />
          <Route path="new-hnss" element={<NewIrrigationSurvey surveyType="hnss" />} />
          <Route path="new-palar" element={<NewIrrigationSurvey surveyType="palar" />} />
          <Route path="survey/:id" element={<ViewIrrigationSurvey />} />
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
