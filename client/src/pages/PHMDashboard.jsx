import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function PHMDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ pregnantMothers: 0, babies: 0, children: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/patients');
        console.log("Patients from API", response.data);
        setPatients(response.data);
        // Calculate statistics
        const pregnantMothers = response.data.filter(p => p.patientType === 'Pregnant Mother').length;
        const babies = response.data.filter(p => p.patientType === 'Baby').length;
        const children = response.data.filter(p => p.patientType === 'Child').length;
  
        setStats({ pregnantMothers, babies, children });
      } catch (err) {
        setError('Failed to load data.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  console.log("Patients", patients.details);
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    (patient.userId.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (patient.patientType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-light-gray)] min-h-screen">
      <Navbar />
      <div className="pt-20 bg-gradient-to-b from-[var(--color-primary-light)]/20 to-transparent">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Header Section with Welcome Message */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">PHM Dashboard</h1>
            <p className="text-[var(--color-dark-gray)]">Welcome back! Here's your maternal and child health overview.</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Pregnant Mothers Card */}
            <div className="bg-gradient-to-br from-[var(--color-white)] to-[var(--color-primary-light)]/5 rounded-xl shadow-md border border-[var(--color-primary-light)]/30 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-primary)] text-sm font-medium uppercase tracking-wider">Pregnant Mothers</p>
                    <h2 className="text-4xl font-bold text-[var(--color-primary)] mt-2">{stats.pregnantMothers}</h2>
                  </div>
                  <div className="w-14 h-14 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[var(--color-primary)]"></div>
            </div>
            
            {/* Babies Card */}
            <div className="bg-gradient-to-br from-[var(--color-white)] to-[var(--color-accent-light)]/10 rounded-xl shadow-md border border-[var(--color-accent-light)]/30 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-primary-dark)] text-sm font-medium uppercase tracking-wider">Babies</p>
                    <h2 className="text-4xl font-bold text-[var(--color-accent-light)] mt-2">{stats.babies}</h2>
                  </div>
                  <div className="w-14 h-14 bg-[var(--color-accent-light)]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-accent-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[var(--color-accent-light)]"></div>
            </div>
            
            {/* Children Card */}
            <div className="bg-gradient-to-br from-[var(--color-white)] to-[var(--color-accent)]/10 rounded-xl shadow-md border border-[var(--color-accent)]/30 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-primary-dark)] text-sm font-medium uppercase tracking-wider">Children</p>
                    <h2 className="text-4xl font-bold text-[var(--color-accent)] mt-2">{stats.children}</h2>
                  </div>
                  <div className="w-14 h-14 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[var(--color-accent)]"></div>
            </div>
          </div>

          {/* Search Bar and Action Button */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[var(--color-primary)]/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border border-[var(--color-primary-light)]/30 rounded-xl bg-[var(--color-white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition-all duration-300"
                placeholder="Search patients by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex">
              <button 
                onClick={() => navigate('/add-patient')}
                className="bg-[var(--color-button)] text-[var(--color-white)] px-5 py-3.5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center font-medium hover:brightness-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Patient
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8">
            {/* Patient List */}
            <div>
              <div className="bg-[var(--color-white)] rounded-xl shadow-md border border-[var(--color-primary-light)]/30 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] border-b border-[var(--color-gray-medium)]">
                  <h2 className="text-xl font-semibold text-[var(--color-white)]">Patient Registry</h2>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[var(--color-primary-light)]"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-red-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-[var(--color-dark-gray)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-3 text-[var(--color-gray-medium)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No patients found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5">
                    {filteredPatients.map((patient) => (
                      <div 
                        key={patient._id} 
                        className={`
                          bg-[var(--color-white)] border border-[var(--color-gray-medium)] rounded-xl p-5 
                          hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                          ${patient.patientType === 'Pregnant Mother' ? 'hover:border-[var(--color-primary)]/50' : 
                            patient.patientType === 'Baby' ? 'hover:border-[var(--color-accent-light)]/50' : 
                            'hover:border-[var(--color-accent)]/50'}
                        `}
                        onClick={() => navigate(`/patient/${patient._id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                          <h3 className="text-xl font-bold text-[var(--color-primary)] leading-tight">{patient.userId.name}</h3>
<span className={`mt-1 inline-block text-xs font-medium ${
  patient.patientType === 'Pregnant Mother' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 
  patient.patientType === 'Baby' ? 'bg-[var(--color-accent-light)]/20 text-[var(--color-primary-dark)]' : 
  'bg-[var(--color-accent)]/20 text-[var(--color-primary-dark)]'
} px-2 py-0.5 rounded-full`}>
  {patient.patientType}
</span>

                          </div>
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${patient.patientType === 'Pregnant Mother' ? 'bg-[var(--color-primary)]/10' : 
                              patient.patientType === 'Baby' ? 'bg-[var(--color-accent-light)]/10' : 
                              'bg-[var(--color-accent)]/10'}
                          `}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`
                              h-4 w-4 
                              ${patient.patientType === 'Pregnant Mother' ? 'text-[var(--color-primary)]' : 
                                patient.patientType === 'Baby' ? 'text-[var(--color-accent-light)]' : 
                                'text-[var(--color-accent)]'}
                            `} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[var(--color-light-gray)] flex justify-end">
                          
                          <button className={`
                            text-sm font-medium transition-colors duration-300
                            ${patient.patientType === 'Pregnant Mother' ? 'text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]' : 
                              patient.patientType === 'Baby' ? 'text-[var(--color-accent-light)] hover:text-[var(--color-primary-dark)]' : 
                              'text-[var(--color-accent)] hover:text-[var(--color-primary-dark)]'}
                          `}>
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {filteredPatients.length > 0 && (
                  <div className="px-6 py-4 bg-[var(--color-light-gray)] border-t border-[var(--color-gray-medium)] text-right">
                    <p className="text-sm text-[var(--color-primary-dark)]/70">Showing <span className="font-medium text-[var(--color-primary)]">{filteredPatients.length}</span> of <span className="font-medium text-[var(--color-primary)]">{patients.length}</span> patients</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default PHMDashboard;