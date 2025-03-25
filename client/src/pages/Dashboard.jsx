import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import NavbarPatient from '../components/NavbarPatient';
import { 
  User, 
  FileText, 
  Calendar, 
  Activity, 
  Clipboard, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Bookmark,
  Heart,
  Shield,
  AlertTriangle
} from 'lucide-react';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-light-gray)' }}>
          <div className="text-center">
            <AlertCircle size={32} style={{ color: 'var(--color-primary)' }} />
            <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--color-primary)' }}>
              Something went wrong.
            </h1>
            <p style={{ color: 'var(--color-dark-gray)' }}>
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [role, setRole] = useState('');
  const [patient, setPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pregnancy');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
      const userIdFromToken = decoded.userId || decoded.id;
      if (!userIdFromToken || userIdFromToken === 'new') {
        setError('Invalid user ID in token.');
        setLoading(false);
        return;
      }
      if (decoded.role === 'patient') {
        fetchPatientByUserId(userIdFromToken);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      navigate('/login');
    }
  }, [navigate]);

  const fetchPatientByUserId = async (userId) => {
    try {
      const res = await axios.get(`/patients/byUserId/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.data || !res.data._id) {
        setError('Patient record not found for this user.');
        setLoading(false);
        return;
      }
      const patientId = res.data._id;
      fetchPatientData(patientId);
    } catch (err) {
      setError('Failed to fetch patient record.');
      console.error('Error fetching patient by userId:', err);
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      const patientRes = await axios.get(`/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPatient(patientRes.data);

      const healthRes = await axios.get(`/healthRecords/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHealthRecords(healthRes.data);
    } catch (err) {
      setError('Error fetching patient data.');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter records by type
  const pregnancyRecords = healthRecords.filter(record => record.recordType === 'Pregnancy Progress');
  const vaccinationRecords = healthRecords.filter(record => record.recordType === 'Vaccination Progress');

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-light-gray)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-purple-600 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderTopColor: 'transparent', borderColor: 'var(--color-primary)' }}></div>
          <p className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
            Loading your health information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-light-gray)' }}>
      <NavbarPatient />
      <div className="max-w-6xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg shadow-md text-center text-white font-medium flex items-center justify-center" 
               style={{ backgroundColor: '#e53e3e' }}>
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 rounded-full mr-3" style={{ backgroundColor: 'var(--color-primary)' }}>
              <User size={24} color="white" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              Patient Dashboard
            </h2>
          </div>
          {patient && (
            <div className="flex items-center px-4 py-2 rounded-full shadow-sm mt-4 md:mt-0" 
                 style={{ backgroundColor: 'var(--color-white)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                   style={{ backgroundColor: 'var(--color-primary-light)' }}>
                <span className="text-white font-bold">
                  {patient.details?.name?.charAt(0) || 'P'}
                </span>
              </div>
              <div>
                <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>
                  {patient.details?.name || 'Patient'}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-gray-medium)' }}>
                  {patient.patientType || 'Standard'} Patient
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Patient Info Card */}
        {patient && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="p-6" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
              <div className="flex items-center">
                <FileText size={24} className="mr-2" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Patient Information</h3>
                  <p className="opacity-80">Your personal health profile</p>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <User size={20} className="mr-3 mt-1" style={{ color: 'var(--color-primary)' }}/>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-gray-medium)' }}>
                    Full Name
                  </p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
                    {patient.details?.name || 'Not Available'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Bookmark size={20} className="mr-3 mt-1" style={{ color: 'var(--color-primary)' }}/>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-gray-medium)' }}>
                    Patient Type
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-primary-dark)' }}>
                    {patient.patientType || 'Standard'}
                  </span>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={20} className="mr-3 mt-1" style={{ color: 'var(--color-primary)' }}/>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-gray-medium)' }}>
                    Last Updated
                  </p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-dark-gray)' }}>
                    {patient.updatedAt ? formatDate(patient.updatedAt) : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Records Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-6 border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
            <div className="flex items-center">
              <Activity size={24} className="mr-2" style={{ color: 'var(--color-primary)' }} />
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  Health Records
                </h3>
                <p className="mt-1" style={{ color: 'var(--color-gray-medium)' }}>
                  Track your healthcare journey
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
            <button
              onClick={() => setActiveTab('pregnancy')}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors duration-200 ${activeTab === 'pregnancy' ? 'border-b-2' : ''}`}
              style={{ 
                borderColor: activeTab === 'pregnancy' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'pregnancy' ? 'var(--color-primary)' : 'var(--color-gray-medium)'
              }}
            >
              <div className="flex items-center justify-center">
                <Heart size={18} className="mr-2" />
                <span>Pregnancy Progress</span>
                {pregnancyRecords.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full" 
                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'white' }}>
                    {pregnancyRecords.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('vaccination')}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors duration-200 ${activeTab === 'vaccination' ? 'border-b-2' : ''}`}
              style={{ 
                borderColor: activeTab === 'vaccination' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'vaccination' ? 'var(--color-primary)' : 'var(--color-gray-medium)'
              }}
            >
              <div className="flex items-center justify-center">
                <Shield size={18} className="mr-2" />
                <span>Vaccination Progress</span>
                {vaccinationRecords.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full" 
                        style={{ backgroundColor: 'var(--color-primary-light)', color: 'white' }}>
                    {vaccinationRecords.length}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pregnancy' && (
              <div>
                {pregnancyRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pregnancyRecords.map((record, index) => (
                      record.recordValue && (
                        <div key={index} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200" 
                             style={{ borderColor: 'var(--color-light-gray)' }}>
                          <div className="p-4 border-b" 
                               style={{ 
                                 backgroundColor: 'var(--color-primary-light)', 
                                 color: 'white', 
                                 borderColor: 'var(--color-primary-light)' 
                               }}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Clock size={18} className="mr-2" />
                                <h4 className="font-bold">
                                  Week {record.recordValue?.gestationalAge || 'N/A'}
                                </h4>
                              </div>
                              <span className="text-sm opacity-80 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(record.date)}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1 flex items-center" style={{ color: 'var(--color-primary)' }}>
                                <Bookmark size={16} className="mr-1" />
                                Milestone
                              </p>
                              <p style={{ color: 'var(--color-dark-gray)' }}>
                                {record.recordValue?.milestone || 'None recorded'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1 flex items-center" style={{ color: 'var(--color-primary)' }}>
                                <AlertTriangle size={16} className="mr-1" />
                                Symptoms
                              </p>
                              <p style={{ color: 'var(--color-dark-gray)' }}>
                                {record.recordValue?.symptoms || 'None recorded'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto mb-4" style={{ color: 'var(--color-primary-light)' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                      No pregnancy records found
                    </p>
                    <p style={{ color: 'var(--color-gray-medium)' }}>
                      Your pregnancy progress information will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vaccination' && (
              <div>
                {vaccinationRecords.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-light-gray)' }}>
                    <table className="min-w-full divide-y" style={{ borderColor: 'var(--color-light-gray)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-light-gray)' }}>
                          <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            <div className="flex items-center">
                              <Shield size={16} className="mr-2" />
                              Vaccine
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            <div className="flex items-center">
                              <Activity size={16} className="mr-2" />
                              Status
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2" />
                              Date
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                            <div className="flex items-center">
                              <Clipboard size={16} className="mr-2" />
                              Notes
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--color-light-gray)' }}>
                        {vaccinationRecords.map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--color-dark-gray)' }}>
                              {record.recordValue?.vaccineName || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" 
                                    style={{ 
                                      backgroundColor: record.recordValue?.status === 'Completed' ? 'var(--color-accent-light)' : 'var(--color-gray-medium)',
                                      color: record.recordValue?.status === 'Completed' ? 'var(--color-primary-dark)' : 'var(--color-dark-gray)'
                                    }}>
                                {record.recordValue?.status === 'Completed' ? 
                                  <CheckCircle size={14} className="mr-1" /> : 
                                  <Clock size={14} className="mr-1" />
                                }
                                {record.recordValue?.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-gray-medium)' }}>
                              {record.recordValue?.dateGiven ? formatDate(record.recordValue.dateGiven) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-dark-gray)' }}>
                              {record.recordValue?.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield size={48} className="mx-auto mb-4" style={{ color: 'var(--color-primary-light)' }} />
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-primary)' }}>
                      No vaccination records found
                    </p>
                    <p style={{ color: 'var(--color-gray-medium)' }}>
                      Your vaccination information will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}
