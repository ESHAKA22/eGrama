import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PHMDashboard from './pages/PHMDashboard';
import AddPatient from './pages/AddPatient';
import PatientPage from './pages/PatientPage'; // Added PatientPage for listing all patients
import PatientDetails from './pages/PatientDetails'; // Added PatientDetails for viewing specific patient
import ProgressTracking from './pages/ProgressTracking'; // Added ProgressTracking for tracking patient progress

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes for Login, Register, and Dashboards */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />    
        <Route path="/patient-dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<PHMDashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/patients" element={<PatientPage />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/progress-tracking/:id" element={<ProgressTracking />} />
      </Routes>
    </Router>
  );
}

export default App;
