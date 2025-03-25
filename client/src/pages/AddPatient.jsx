import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

function AddPatient() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [patientType, setPatientType] = useState('Pregnant Mother');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch existing users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

  // Handle the selection of users to add as patients
  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (selectedUsers.length === 0) {
      setError('Please select at least one user to add as a patient.');
      setIsLoading(false);
      return;
    }

    // Prepare the data to send to the backend
    const patientData = selectedUsers.map((userId) => ({
      userId,
      patientType,
    }));

    try {
      await axios.post('/patients/addExistingUser', { patients: patientData });
      navigate('/dashboard'); // Redirect to dashboard after adding patients
    } catch (err) {
      setError('Failed to add patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--color-light-gray)]">
      <Navbar />
      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">Add New Patient</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-medium flex items-center transition-colors duration-200 rounded-lg px-4 py-2 hover:bg-[var(--color-primary)]/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm animate-pulse">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white shadow-xl rounded-xl mb-8 overflow-hidden border border-[var(--color-gray-medium)]">
            <div className="p-8 border-b border-[var(--color-gray-medium)] bg-gradient-to-r from-[var(--color-primary-light)]/10 to-[var(--color-primary)]/5">
              <h2 className="text-xl font-semibold text-[var(--color-primary-dark)] mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-[var(--color-dark-gray)] mb-2 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-[var(--color-primary-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Users
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[var(--color-primary-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-full border border-[var(--color-gray-medium)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all duration-200"
                      placeholder="Search by name..."
                    />
                  </div>
                </div>

                {/* Patient Type Selection */}
                <div>
                  <label htmlFor="patientType" className="block text-sm font-medium text-[var(--color-dark-gray)] mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[var(--color-primary-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Patient Type
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <select
                      id="patientType"
                      value={patientType}
                      onChange={(e) => setPatientType(e.target.value)}
                      className="w-full pl-3 pr-10 py-3 border border-[var(--color-gray-medium)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all duration-200 appearance-none"
                    >
                      <option value="Pregnant Mother">Pregnant Mother</option>
                      <option value="Baby">Baby</option>
                      <option value="Child">Child</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-[var(--color-primary-light)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gradient-to-r from-[var(--color-light-gray)] to-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-primary)] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Available Users
                </h2>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-accent-light)] text-[var(--color-primary-dark)] shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedUsers.length} selected
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-[var(--color-light-gray)]/50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--color-gray-medium)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-[var(--color-primary-dark)] font-medium text-lg">No users found matching your search.</p>
                  <p className="text-[var(--color-primary-light)]/80 mt-2">Try using different search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user._id} 
                      onClick={() => handleUserSelection(user._id)}
                      className={`py-4 px-4 flex items-center cursor-pointer rounded-lg transition-all duration-200 ${
                        selectedUsers.includes(user._id) 
                          ? 'bg-[var(--color-accent-light)]/20 border border-[var(--color-accent)] shadow-md transform scale-102' 
                          : 'hover:bg-[var(--color-light-gray)] border border-transparent hover:border-[var(--color-gray-medium)]'
                      }`}
                    >
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[var(--color-primary-light)]/20 flex items-center justify-center shadow-inner">
                        <span className="text-[var(--color-primary)] font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-[var(--color-dark-gray)]">{user.name}</p>
                        {user.email && <p className="text-sm text-gray-500 truncate">{user.email}</p>}
                      </div>
                      <div>
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                          selectedUsers.includes(user._id) 
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' 
                            : 'border-[var(--color-gray-medium)]'
                        }`}>
                          {selectedUsers.includes(user._id) && (
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || selectedUsers.length === 0}
              className={`py-3 px-8 rounded-lg shadow-lg font-medium flex items-center transition-all duration-200 text-white ${
                selectedUsers.length === 0
                ? 'bg-[var(--color-gray-medium)] cursor-not-allowed'
                : 'bg-[var(--color-button)] hover:bg-[var(--color-accent)] hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Selected Patients ({selectedUsers.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;