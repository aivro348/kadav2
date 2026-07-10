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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="surveys" element={<SurveyList />} />
          <Route path="surveys/:id" element={<ViewSurvey />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Surveyor Routes */}
        <Route path="/surveyor" element={<SurveyorLayout />}>
          <Route index element={<SurveyList />} />
          <Route path="new" element={<NewSurvey />} />
          <Route path=":id" element={<ViewSurvey />} />
        </Route>

        {/* Default Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
