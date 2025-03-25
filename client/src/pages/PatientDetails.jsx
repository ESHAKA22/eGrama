import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [suggestedParameters, setSuggestedParameters] = useState([]);
  const [newField, setNewField] = useState({ label: '', value: '', unit: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggested');
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ label: '', unit: '', value: '' });

  // Predefined suggested parameters for each patient category
  const suggestedParams = {
    'Pregnant Mother': [
      { label: 'Weight', name: 'weight', type: 'number', unit: 'kg', icon: '⚖️' },
      { label: 'Blood Pressure', name: 'bloodPressure', type: 'text', unit: 'mmHg', icon: '❤️' },
      { label: 'Gestational Age', name: 'gestationalAge', type: 'number', unit: 'weeks', icon: '🗓️' },
      { label: 'Urine Tests', name: 'urineTests', type: 'text', icon: '🧪' },
      { label: 'Fetal Heart Rate', name: 'fetalHeartRate', type: 'number', unit: 'bpm', icon: '💓' },
    ],
    'Baby': [
      { label: 'Apgar Score', name: 'apgarScore', type: 'number', unit: 'points', icon: '📊' },
      { label: 'Weight', name: 'weight', type: 'number', unit: 'kg', icon: '⚖️' },
      { label: 'Respiratory Health', name: 'respiratoryHealth', type: 'text', icon: '🫁' },
      { label: 'Feeding and Nutrition', name: 'feeding', type: 'text', icon: '🍼' },
    ],
    'Child': [
      { label: 'Vaccination Status', name: 'vaccinationStatus', type: 'text', icon: '💉' },
      { label: 'Growth and Development', name: 'growthAndDevelopment', type: 'text', icon: '📏' },
      { label: 'General Health', name: 'generalHealth', type: 'text', icon: '🏥' },
    ],
  };

  // Fetch the patient data and suggested parameters
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`/patients/${id}`);
        setPatient(response.data);
        setSuggestedParameters(suggestedParams[response.data.patientType] || []);

        // Initialize customFields with any existing data
        if (response.data.details && typeof response.data.details === 'object') {
          const existingFields = Object.entries(response.data.details)
            .filter(([key]) => key !== 'name') // Exclude name field
            .map(([key, value]) => {
              // Find if this is a suggested parameter
              const suggestedParam = (suggestedParams[response.data.patientType] || [])
                .find(param => param.label === key);
              return {
                label: key,
                name: suggestedParam?.name || key.toLowerCase().replace(/\s+/g, ''),
                value: value || '',
                unit: suggestedParam?.unit || '',
                type: suggestedParam?.type || 'text',
                icon: suggestedParam?.icon || '📝'
              };
            });
          setCustomFields(existingFields);
        }
      } catch (error) {
        console.error('Error fetching patient details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  // Handle adding a parameter to custom fields
  const handleAddParameter = (param) => {
    if (!customFields.some(field => field.name === param.name)) {
      setCustomFields((prevFields) => [
        ...prevFields,
        {
          label: param.label,
          name: param.name,
          value: '',
          unit: param.unit || '',
          type: param.type || 'text',
          icon: param.icon || '📝'
        },
      ]);
      setHasChanges(true);
      setActiveTab('custom');
    }
  };

  // Handle input change for custom fields
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...customFields];
    updatedFields[index][name] = value;
    setCustomFields(updatedFields);
    setHasChanges(true);
  };

  // Handle input change for new custom fields
  const handleNewFieldChange = (e) => {
    const { name, value } = e.target;
    let error = '';
  
    if (name === 'label' || name === 'unit') {
      // Allow letters and spaces only
      if (!/^[A-Za-z\s]*$/.test(value)) {
        error = 'Enter only letters';
      }
    } else if (name === 'value') {
      // Allow numbers and optional decimal
      if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
        error = 'Enter only numbers';
      }
    }
  
    setErrors((prev) => ({ ...prev, [name]: error }));
    setNewField((prevField) => ({ ...prevField, [name]: value }));
  };

  // Add new custom field to the form
  const handleAddNewCustomField = () => {
    if (newField.label) {
      setCustomFields((prevFields) => [
        ...prevFields,
        {
          label: newField.label,
          name: newField.label.toLowerCase().replace(/\s+/g, ''),
          value: newField.value || '',
          unit: newField.unit || '',
          type: 'text',
          icon: '📝'
        },
      ]);
      setNewField({ label: '', value: '', unit: '' });
      setHasChanges(true);
      setActiveTab('custom');
    }
  };

  // Handle removing a field
  const handleRemoveField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
    setHasChanges(true);
  };

  // Handle navigation away with unsaved changes
  const handleNavigateAway = () => {
    if (hasChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      navigate(`/patient/${id}`);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const details = customFields.reduce((acc, field) => {
        if (field.label) {
          acc[field.label] = field.value;
        }
        return acc;
      }, {});
      await axios.put(`/patients/updateDetails/${id}`, { details });
      setHasChanges(false);
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error('Error updating patient details', error);
    } finally {
      setSaving(false);
    }
  };

  // Navigate to the ProgressTracking page (for Pregnancy Progress)
  const handleTrackPregnancyProgress = () => {
    navigate(`/progress-tracking/${id}`);
  };
  return (
    <div className="min-h-screen bg-[var(--color-light-gray)]">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
            <p className="mt-4 text-[var(--color-dark-gray)]">Loading patient information...</p>
          </div>
        ) : (
          <div className="bg-[var(--color-white)] rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1 text-white text-sm backdrop-blur-sm">
                {patient?.patientType}
              </div>
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm">
                  {patient?.patientType === 'Pregnant Mother' ? '👩‍🍼' : patient?.patientType === 'Baby' ? '👶' : '👧'}
                </div>
                <div className="ml-5">
                  <h1 className="text-2xl font-bold text-white">
                    {patient?.details?.name || 'Patient'}
                  </h1>
                  <div className="flex items-center text-white/80 mt-1">
                  <span className="inline-block mr-3">
  {patient?.userId?.name || 'Unnamed Patient'}
</span>

                    <span className="inline-block h-1 w-1 rounded-full bg-white/50"></span>
                    <span className="inline-block ml-3">Health Parameters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation section for Suggested/Custom tabs and progress tracking */}
            <div className="border-b border-[var(--color-gray-medium)]">
              <nav className="flex -mb-px justify-between items-center px-4">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('suggested')}
                    className={`px-6 py-4 text-sm font-medium relative ${
                      activeTab === 'suggested'
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-dark-gray)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    Suggested Parameters
                    {activeTab === 'suggested' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`px-6 py-4 text-sm font-medium relative ${
                      activeTab === 'custom'
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-dark-gray)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    Added Parameters 
                    <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-[var(--color-light-gray)]">
                      {customFields.length}
                    </span>
                    {activeTab === 'custom' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]"></span>
                    )}
                  </button>
                </div>
                {/* Track Pregnancy Progress button is visible only for Pregnant Mother */}
                {patient?.patientType === 'Pregnant Mother' && (
                  <button
                    onClick={handleTrackPregnancyProgress}
                    className="px-6 py-4 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-primary)]"
                  >
                    Track Pregnancy Progress
                  </button>
                )}
              </nav>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                {activeTab === 'suggested' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-[var(--color-dark-gray)]">
                        Recommended Health Parameters
                      </h2>
                      <span className="text-sm text-[var(--color-dark-gray)]">Click + to add to your form</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestedParameters.map((param, index) => {
                        const isAdded = customFields.some(field => field.name === param.name);
                        return (
                          <div 
                            key={index} 
                            className={`border rounded-xl p-4 transition-all ${
                              isAdded 
                                ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]/10' 
                                : 'border-[var(--color-gray-medium)] bg-white hover:shadow-md hover:border-[var(--color-primary-light)]'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-xl mr-3" aria-hidden="true">{param.icon}</span>
                                <div>
                                  <p className={`font-medium ${isAdded ? 'text-[var(--color-accent)]' : 'text-[var(--color-dark-gray)]'}`}>
                                    {param.label}
                                  </p>
                                  {param.unit && <p className="text-sm text-[var(--color-dark-gray)]">Unit: {param.unit}</p>}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => !isAdded && handleAddParameter(param)}
                                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                                  isAdded 
                                    ? 'bg-[var(--color-accent)] text-white cursor-default' 
                                    : 'bg-[var(--color-light-gray)] text-[var(--color-dark-gray)] hover:bg-[var(--color-accent)] hover:text-white'
                                }`}
                                disabled={isAdded}
                                aria-label={isAdded ? 'Parameter added' : `Add ${param.label}`}
                              >
                                {isAdded ? '✓' : '+'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-8 border-t border-[var(--color-light-gray)] pt-6">
                      <h3 className="text-md font-medium text-[var(--color-dark-gray)] mb-4">Add Custom Parameter</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="newFieldLabel" className="block text-sm text-[var(--color-dark-gray)] mb-1">Parameter Name</label>
                          <input
                            type="text"
                            id="newFieldLabel"
                            name="label"
                            value={newField.label}
                            onChange={handleNewFieldChange}
                            className="pl-3 pr-4 py-2 w-full border border-[var(--color-gray-medium)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                            placeholder="e.g., Heart Rate"
                          />
                          {errors.label && (
  <p className="text-red-500 text-sm mt-1">{errors.label}</p>
)}
                        </div>
                        <div>
                          <label htmlFor="newFieldUnit" className="block text-sm text-[var(--color-dark-gray)] mb-1">Unit (Optional)</label>
                          <input
                            type="text"
                            id="newFieldUnit"
                            name="unit"
                            value={newField.unit}
                            onChange={handleNewFieldChange}
                            className="pl-3 pr-4 py-2 w-full border border-[var(--color-gray-medium)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                            placeholder="e.g., bpm"
                          />
                          {errors.unit && (
  <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
)}
                        </div>
                        <div>
                          <label htmlFor="newFieldValue" className="block text-sm text-[var(--color-dark-gray)] mb-1">Initial Value (Optional)</label>
                          <div className="flex">
                            <input
                              type="text"
                              id="newFieldValue"
                              name="value"
                              value={newField.value}
                              onChange={handleNewFieldChange}
                              className="pl-3 pr-4 py-2 w-full border border-[var(--color-gray-medium)] rounded-l-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                              placeholder="e.g., 72"
                            />
                            
                            <button
                              type="button"
                              onClick={handleAddNewCustomField}
                              disabled={!newField.label || Object.values(errors).some(error => error !== '')}
                              className="px-4 bg-[var(--color-button)] text-white rounded-r-lg hover:bg-opacity-90 transition-colors disabled:bg-[var(--color-gray-medium)] disabled:cursor-not-allowed"
                              
                            >
                              Add
                            </button>
                          </div>
                          {errors.value && (
  <p className="text-red-500 text-sm mt-1">{errors.value}</p>
)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-[var(--color-dark-gray)]">Health Parameters</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('suggested')}
                        className="text-sm text-[var(--color-accent)] hover:underline"
                      >
                        + Add more parameters
                      </button>
                    </div>
                    
                    {customFields.length === 0 ? (
                      <div className="bg-[var(--color-light-gray)] rounded-lg p-12 text-center">
                        <p className="text-[var(--color-dark-gray)] mb-4">No parameters added yet.</p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('suggested')}
                          className="px-4 py-2 bg-[var(--color-button)] text-white rounded-md"
                        >
                          Add Parameters
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {customFields.map((field, index) => (
                          <div 
                            key={index} 
                            className="bg-white border border-[var(--color-gray-medium)] rounded-xl p-4 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-xl mr-3" aria-hidden="true">{field.icon}</span>
                                <label htmlFor={`value-${index}`} className="block font-medium text-[var(--color-dark-gray)]">
                                  {field.label}
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(index)}
                                className="text-[var(--color-gray-medium)] hover:text-red-500 transition-colors"
                                aria-label={`Remove ${field.label}`}
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={field.type || "text"}
                                id={`value-${index}`}
                                name="value"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, e)}
                                className={`pl-3 pr-${field.unit ? '16' : '4'} py-2 w-full border border-[var(--color-gray-medium)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all`}
                                placeholder={`Enter ${field.label} value`}
                              />
                              {field.unit && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-[var(--color-dark-gray)]">{field.unit}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[var(--color-gray-medium)] flex justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={handleNavigateAway}
                    className="px-5 py-2.5 border border-[var(--color-gray-medium)] rounded-lg text-[var(--color-dark-gray)] hover:bg-[var(--color-light-gray)] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-[var(--color-button)] text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm font-medium flex items-center"
                    disabled={customFields.length === 0 || saving}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Parameters'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Unsaved Changes Modal */}
        {showUnsavedChangesModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-bold text-[var(--color-dark-gray)] mb-2">Unsaved Changes</h3>
              <p className="text-[var(--color-dark-gray)] mb-4">You have unsaved changes. Are you sure you want to leave this page?</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowUnsavedChangesModal(false)}
                  className="px-4 py-2 text-[var(--color-dark-gray)] border border-[var(--color-gray-medium)] rounded-md hover:bg-[var(--color-light-gray)]"
                >
                  Continue Editing
                </button>
                <button 
                  onClick={() => {
                    setShowUnsavedChangesModal(false);
                    navigate(`/patient/${id}`);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;