import React, { useState, useEffect, useMemo } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Search, User, ChevronRight, ChevronDown, X, AlertCircle, Check,
  Users, Calendar, Filter, Download, Trash
} from 'lucide-react';

function PatientPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientTypeFilter, setPatientTypeFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Statistics for the dashboard summary
  const stats = useMemo(() => {
    if (!patients.length) return { total: 0, types: {} };
    
    const types = patients.reduce((acc, patient) => {
      acc[patient.patientType] = (acc[patient.patientType] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: patients.length,
      types
    };
  }, [patients]);

  // Fetch Patients from the backend API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/patients');
        setPatients(response.data);
        setFilteredPatients(response.data);
        console.log("patients",response.data);
      } catch (err) {
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Sort and filter patients
  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((patient) =>
        patient.details?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (patientTypeFilter) {
      result = result.filter((patient) => patient.patientType === patientTypeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch(sortField) {
        case 'name':
          valueA = a.details?.name || '';
          valueB = b.details?.name || '';
          break;
        case 'type':
          valueA = a.patientType || '';
          valueB = b.patientType || '';
          break;
        default:
          valueA = a.details?.name || '';
          valueB = b.details?.name || '';
      }
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    
    setFilteredPatients(result);
  }, [patients, searchTerm, patientTypeFilter, sortField, sortDirection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setPatientTypeFilter(e.target.value);
  };

  const handleSort = (field) => {
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const togglePatientSelection = (patientId) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPatients.length === filteredPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map(p => p._id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPatientTypeFilter('');
    setSortField('name');
    setSortDirection('asc');
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const navigateToPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Get patient type badge color - using updated theme color palette
  const getPatientTypeBadgeColor = (type) => {
    switch (type) {
      case 'Pregnant Mother':
        return 'bg-[#6A5ACD]/20 text-[#4B0082] border border-[#6A5ACD]/30';
      case 'Baby': 
        return 'bg-[#81C784]/20 text-[#4CAF50] border border-[#81C784]/30';
      case 'Child':
        return 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitialLetter = (name) => {
    return (name?.charAt(0) || '?').toUpperCase();
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions here (export, delete, etc.)
    showToast(`${action} ${selectedPatients.length} patients`, 'success');
    setSelectedPatients([]);
  };

  const deletePatient = async (patientId) => {
    try {
      await axios.delete(`/patients/${patientId}`);
      setPatients(patients.filter(patient => patient._id !== patientId));
      setFilteredPatients(filteredPatients.filter(patient => patient._id !== patientId));
      showToast('Patient deleted successfully', 'success');
    } catch (err) {
      setError('Failed to delete patient. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      {/* Toast notification */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-[#81C784] text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
            {toast.type === 'success' ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <X className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="ml-3 text-sm font-medium">{toast.message}</div>
          <button 
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-auto -mx-1.5 -my-1.5 text-white rounded-lg p-1.5 hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header with Stats Cards - Purple Background */}
<div className="mb-8 bg-[#6A5ACD]/10 rounded-xl p-6">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-[#4B0082]">Patient Management</h1>
      <p className="mt-2 text-sm text-[#333333]/80">View, search, and manage all patient records in one place</p>
    </div>
    {/* Add New Patient button removed */}
  </div>
  
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-[#6A5ACD]/10 text-[#6A5ACD]">
          <Users className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-[#333333]/60 font-medium">Total Patients</p>
          <h3 className="text-2xl font-bold text-[#4B0082]">{stats.total}</h3>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-[#81C784]/10 text-[#4CAF50]">
          <Users className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-[#333333]/60 font-medium">Pregnant Mothers</p>
          <h3 className="text-2xl font-bold text-[#4B0082]">{stats.types['Pregnant Mother'] || 0}</h3>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-[#4CAF50]/10 text-[#4CAF50]">
          <Calendar className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-[#333333]/60 font-medium">Children & Babies</p>
          <h3 className="text-2xl font-bold text-[#4B0082]">{(stats.types['Baby'] || 0) + (stats.types['Child'] || 0)}</h3>
        </div>
      </div>
    </div>
  </div>
</div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-[#E0E0E0] overflow-hidden">
          <div className="p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#6A5ACD]" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent transition-all"
                  placeholder="Search patients by name..."
                />
              </div>
              
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="inline-flex items-center px-4 py-2.5 border border-[#E0E0E0] text-sm font-medium rounded-lg bg-white hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] text-[#4B0082]"
              >
                <Filter className="h-5 w-5 mr-2 text-[#4B0082]" />
                Filters
                <ChevronDown className={`ml-2 h-4 w-4 text-[#6A5ACD] transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Expanded Filter Options */}
            {isFilterExpanded && (
              <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#333333] mb-1">Patient Type</label>
                    <select
                      value={patientTypeFilter}
                      onChange={handleFilterChange}
                      className="block w-full pl-4 pr-10 py-2.5 text-base border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent rounded-lg appearance-none transition-all"
                    >
                      <option value="">All Patient Types</option>
                      <option value="Pregnant Mother">Pregnant Mother</option>
                      <option value="Baby">Baby</option>
                      <option value="Child">Child</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                      <ChevronDown className="h-4 w-4 text-[#6A5ACD]" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#333333] mb-1">Sort By</label>
                    <select
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-base border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent rounded-lg appearance-none transition-all"
                    >
                      <option value="name">Name</option>
                      <option value="type">Type</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                      <ChevronDown className="h-4 w-4 text-[#6A5ACD]" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#333333] mb-1">Order</label>
                    <select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-base border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] focus:border-transparent rounded-lg appearance-none transition-all"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                      <ChevronDown className="h-4 w-4 text-[#6A5ACD]" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-[#E0E0E0] text-sm font-medium rounded-lg bg-white hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] text-[#4B0082]"
                  >
                    <X className="h-4 w-4 mr-2 text-[#4B0082]" />
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Actions Bar - Shows when patients are selected */}
        {selectedPatients.length > 0 && (
          <div className="bg-[#4B0082]/5 border border-[#4B0082]/20 rounded-xl mb-6 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6A5ACD] text-white font-bold mr-3">
                  {selectedPatients.length}
                </div>
                <span className="text-[#4B0082] font-medium">patients selected</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkAction('Exported')}
                  className="flex items-center px-3 py-1.5 rounded-lg border border-[#4B0082] text-[#4B0082] hover:bg-[#4B0082]/10 text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Export
                </button>
                <button 
                  onClick={() => setSelectedPatients([])}
                  className="flex items-center px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-medium"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancel Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area - List View Only */}
        <div className="transition-all">
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-[#E0E0E0]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B0082]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#E0E0E0]">
              <div className="bg-[#F5F5F5] rounded-full h-20 w-20 flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-[#6A5ACD]" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-[#4B0082]">No patients found</h3>
              <p className="mt-1 text-sm text-[#333333]">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-[#55C057] hover:bg-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5ACD]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            // List View Only with Enhanced Design
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E0E0E0]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E0E0E0]">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#333333]/70 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-[#4B0082] focus:ring-[#6A5ACD] border-[#E0E0E0] rounded"
                            onChange={toggleSelectAll}
                            checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                          />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-[#333333]/70 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          <span>Name</span>
                          {sortField === 'name' && (
                            <ChevronRight className={`ml-1 h-4 w-4 transform ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'} text-[#4B0082]`} />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-[#333333]/70 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center">
                          <span>Type</span>
                          {sortField === 'type' && (
                            <ChevronRight className={`ml-1 h-4 w-4 transform ${sortDirection === 'asc' ? 'rotate-90' : '-rotate-90'} text-[#4B0082]`} />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#333333]/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#E0E0E0]">
                    {filteredPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-[#F5F5F5] transition-colors cursor-pointer" onClick={() => navigateToPatientDetails(patient._id)}>
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPatients.includes(patient._id)}
                              onChange={() => togglePatientSelection(patient._id)}
                              className="h-4 w-4 text-[#4B0082] focus:ring-[#6A5ACD] border-[#E0E0E0] rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#4B0082] to-[#6A5ACD] flex items-center justify-center text-white font-semibold">
                              {getInitialLetter(patient.userId?.name)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-[#333333]">{patient.details?.name}</div>
                              <div className="text-xs text-[#333333]/60">{patient.userId.name?.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPatientTypeBadgeColor(patient.patientType)}`}>
                            {patient.patientType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToPatientDetails(patient._id);
                            }}
                            className="px-3 py-1.5 text-sm text-white bg-[#55C057] hover:bg-[#4CAF50] rounded-lg transition-colors shadow-sm font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePatient(patient._id);
                            }}
                            className="ml-2 px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#F5F5F5] px-6 py-4 border-t border-[#E0E0E0]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-[#333333]">
                    Showing <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> patients
                  </div>
                  {/* Export All button removed */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientPage;