import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';

function ProgressTracking() {
  const { id } = useParams(); // Patient ID from URL

  const [patient, setPatient] = useState(null);
  const [pregnancyProgress, setPregnancyProgress] = useState([]);
  const [vaccinationProgress, setVaccinationProgress] = useState([]);
  const [newPregnancyProgress, setNewPregnancyProgress] = useState({ gestationalAge: '', symptoms: '', milestone: '' });
  const [newVaccinationProgress, setNewVaccinationProgress] = useState({ vaccineName: '', dateGiven: '', status: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pregnancy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gestationalAgeError, setGestationalAgeError] = useState('');

  // Fetch patient and progress data
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`/patients/${id}`);
        setPatient(response.data);

        // Fetch Pregnancy and Vaccination Progress
        const healthRecordsRes = await axios.get(`/healthRecords/${id}`);
        setPregnancyProgress(
          healthRecordsRes.data.filter(record => record.recordType === 'Pregnancy Progress')
        );
        setVaccinationProgress(
          healthRecordsRes.data.filter(record => record.recordType === 'Vaccination Progress')
        );
      } catch (error) {
        console.error("Error fetching patient details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  // Generate a professional PDF report using jsPDF and jspdf-autotable
  const handleGenerateReport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let yPosition = margin;
    
    // Add logo
    const logoWidth = 100;
    const logoHeight = 90;
    try {
      doc.addImage(logo, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 30;
    } catch (error) {
      console.error("Error loading logo:", error);
      yPosition += 20; // Add space even if logo fails to load
    }
    
    // Report Title with enhanced styling
    doc.setFontSize(24);
    doc.setTextColor(63, 81, 181); // Modern blue color
    doc.setFont("helvetica", "bold");
    doc.text("Pregnancy Progress Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 35;
    
    // Add a decorative line with enhanced appearance
    doc.setDrawColor(63, 81, 181);
    doc.setLineWidth(1.5);
    doc.line(margin + 50, yPosition, pageWidth - margin - 50, yPosition);
    yPosition += 30;
    
    // Patient Information section with improved styling
    doc.setFontSize(15);
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", margin, yPosition);
    yPosition += 25;
    
    // Patient details in a cleaner format
    doc.setFontSize(12);
    doc.setTextColor(90, 90, 90);
    doc.setFont("helvetica", "normal");
    
    if (patient && patient.details) {
      doc.text(`Name: `, margin, yPosition);
      doc.setFont("helvetica", "bold");
      doc.text(patient?.userId?.name || "N/A", margin + 80, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 35;
    }
    
    // Summary statistics in an improved box - removed dark background color
    if (pregnancyProgress.length > 0) {
      const currentRecord = pregnancyProgress[pregnancyProgress.length - 1];
      
      // Create a light background for the status section
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 50, 3, 3, 'F');
      
      yPosition += 15;
      doc.setFontSize(14);
      doc.setTextColor(63, 81, 181);
      doc.setFont("helvetica", "bold");
      doc.text("Current Pregnancy Status", margin + 15, yPosition);
      
      yPosition += 25;
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      
      const current = currentRecord.recordValue || {};
      doc.text(`Current Gestational Age: ${current.gestationalAge || "N/A"}`, margin + 15, yPosition);
      doc.text(`Latest Milestone: ${current.milestone || "N/A"}`, pageWidth / 2 + 15, yPosition);
      
      yPosition += 40; // Increased spacing after the status box
    }
    
    // Progress graph with improved spacing
    if (pregnancyProgress.length > 0) {
      // Create a softer background for the chart
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 120, 5, 5, 'F');
      
      // Chart title with enhanced styling
      yPosition += 25;
      doc.setFontSize(14);
      doc.setTextColor(63, 81, 181);
      doc.setFont("helvetica", "bold");
      doc.text("Pregnancy Timeline", pageWidth / 2, yPosition, { align: "center" });
      
      // Enhanced timeline visualization
      const timelineWidth = pageWidth - (margin * 2) - 40;
      const startX = margin + 20;
      const progressY = yPosition + 45;
      
      // Draw the timeline base
      doc.setDrawColor(200, 200, 220);
      doc.setLineWidth(4);
      doc.line(startX, progressY, startX + timelineWidth, progressY);
      
      // Calculate and draw the current progress point
      if (pregnancyProgress.length > 0) {
        const lastRecord = pregnancyProgress[pregnancyProgress.length - 1];
        const gestWeek = parseInt(lastRecord.recordValue?.gestationalAge) || 0;
        const progress = Math.min(Math.max(gestWeek / 40, 0), 1); // Assuming 40 weeks full term
        
        const progressX = startX + (timelineWidth * progress);
        
        // Progress circle with improved appearance
        doc.setFillColor(63, 81, 181);
        doc.circle(progressX, progressY, 8, 'F');
        
        // Add text labels with improved spacing
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Week 0", startX, progressY + 25);
        doc.text("Week 40", startX + timelineWidth, progressY + 25);
        
        // Add trimester markers with proper spacing
        doc.setTextColor(150, 150, 150);
        doc.text("1st Trimester", startX + (timelineWidth * 0.13), progressY + 40);
        doc.text("2nd Trimester", startX + (timelineWidth * 0.38), progressY + 40);
        doc.text("3rd Trimester", startX + (timelineWidth * 0.75), progressY + 40);
        
        // Current week marker with improved spacing
        doc.setTextColor(63, 81, 181);
        doc.setFont("helvetica", "bold");
        doc.text(`Week ${gestWeek}`, progressX, progressY - 20, { align: "center" });
      }
      
      yPosition += 105; // Increased spacing after the timeline
    }
    
    // Enhanced table styling with better spacing
    const columns = [
      { header: "Date", dataKey: "date", width: 90 },
      { header: "Gestational Age", dataKey: "gestationalAge", width: 110 },
      { header: "Milestone", dataKey: "milestone" },
      { header: "Symptoms", dataKey: "symptoms" }
    ];
    
    const rows = pregnancyProgress.map(record => ({
      date: new Date(record.date).toLocaleDateString(),
      gestationalAge: record.recordValue?.gestationalAge || "N/A",
      milestone: record.recordValue?.milestone || "N/A",
      symptoms: record.recordValue?.symptoms || "N/A"
    }));
    
    // Section title before table with improved spacing
    doc.setFontSize(15);
    doc.setTextColor(70, 70, 70);
    doc.setFont("helvetica", "bold");
    doc.text("Pregnancy Progress History", margin, yPosition);
    yPosition += 25; // Increased spacing before table
    
    // Generate table using autoTable with improved spacing
    autoTable(doc, {
      startY: yPosition,
      head: [columns.map(col => col.header)],
      body: rows.map(row => [
        row.date,
        row.gestationalAge,
        row.milestone,
        row.symptoms
      ]),
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 8, // Increased cell padding for better spacing
        lineColor: [220, 220, 220],
        lineWidth: 0.5
      },
      headStyles: { 
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 11
      },
      alternateRowStyles: {
        fillColor: [245, 247, 255]
      },
      columnStyles: {
        0: { cellWidth: columns[0].width },
        1: { cellWidth: columns[1].width },
        2: { halign: 'left' },
        3: { halign: 'left' }
      },
      margin: { left: margin, right: margin }
    });
    
    // Footer with improved spacing
    const totalPages = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Add footer with improved spacing
      doc.setDrawColor(63, 81, 181);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 50, pageWidth - margin, pageHeight - 50);
      
      // Date generated with better spacing
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text(`Report generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 30);
      
      // Page numbers with better spacing
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
      
      // App name with better spacing
      doc.setTextColor(63, 81, 181);
      doc.setFont("helvetica", "italic");
      doc.text("Pregnancy Progress Tracker", pageWidth / 2, pageHeight - 30, { align: "center" });
    }
    
    // Save the PDF
    doc.save("Pregnancy_Progress_Report.pdf");
  };

  // Fix: Ensure new records follow the same structure as the fetched records
  const handleAddPregnancyProgress = async () => {
    if (!newPregnancyProgress.gestationalAge || !newPregnancyProgress.milestone) {
      alert('Please fill in all required fields');
      return;
    }
  
    // Convert to number and validate
    const gestationalAge = parseInt(newPregnancyProgress.gestationalAge, 10);
    if (gestationalAge > 40) {
      setGestationalAgeError('Max week size should be 40');
      return;
    }
  
    // Clear any existing errors
    setGestationalAgeError('');
  
    setIsSubmitting(true);
    try {
      // Wrap the new progress in the expected object structure
      const progressData = {
        recordType: "Pregnancy Progress",
        patientId: id,
        date: new Date(), // you might use the server-generated date instead
        recordValue: {
          gestationalAge: newPregnancyProgress.gestationalAge,
          milestone: newPregnancyProgress.milestone,
          symptoms: newPregnancyProgress.symptoms
        }
      };
      await axios.post('/healthRecords/pregnancy-progress', progressData);
      setPregnancyProgress([...pregnancyProgress, progressData]);
      setNewPregnancyProgress({ gestationalAge: '', symptoms: '', milestone: '' });
    } catch (error) {
      console.error("Error adding pregnancy progress", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVaccinationProgress = async () => {
    if (!newVaccinationProgress.vaccineName || !newVaccinationProgress.dateGiven || !newVaccinationProgress.status) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Wrap the new vaccination record in the expected structure
      const progressData = {
        recordType: "Vaccination Progress",
        patientId: id,
        date: new Date(newVaccinationProgress.dateGiven), // or new Date() if you prefer the submission time
        recordValue: {
          vaccineName: newVaccinationProgress.vaccineName,
          dateGiven: newVaccinationProgress.dateGiven,
          status: newVaccinationProgress.status,
          notes: newVaccinationProgress.notes
        }
      };
      await axios.post('/healthRecords/vaccination-progress', progressData);
      setVaccinationProgress([...vaccinationProgress, progressData]);
      setNewVaccinationProgress({ vaccineName: '', dateGiven: '', status: '', notes: '' });
    } catch (error) {
      console.error("Error adding vaccination progress", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Patient Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] p-8 relative mb-8 rounded-xl shadow-2xl">
          <div className="absolute top-4 right-4 flex space-x-3">
            <span className="bg-white/20 rounded-full px-3 py-1 text-white text-sm backdrop-blur-sm">
              {patient?.patientType}
            </span>
            {/* Report Button placed at top right */}
            <button 
              onClick={handleGenerateReport}
              className="flex items-center bg-white text-[var(--color-primary-dark)] px-4 py-2 rounded-lg font-medium shadow hover:shadow-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center text-2xl backdrop-blur-sm mr-4">
                {patient?.userId?.name ? patient.userId.name.charAt(0) : "?"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {patient?.userId?.name || "No Name"}
                </h1>
                <p className="text-white/80 mt-1">
                  <span className="inline-block mr-3">ID: {id.substring(0, 8)}</span>
                  <span>{patient?.details?.age || "N/A"} years old</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex border-b border-white/50 overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'pregnancy' 
                  ? 'text-white border-white'
                  : 'text-white/70 border-transparent hover:border-white'
              }`}
              onClick={() => setActiveTab('pregnancy')}
            >
              Pregnancy Progress
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'vaccination' 
                  ? 'text-white border-white'
                  : 'text-white/70 border-transparent hover:border-white'
              }`}
              onClick={() => setActiveTab('vaccination')}
            >
              Vaccination Records
            </button>
          </div>
        </div>
        
        {/* Pregnancy Progress Section */}
        {activeTab === 'pregnancy' && (
          <div className="space-y-8">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-xl p-6 transition-shadow hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Pregnancy Timeline</h2>
              </div>
              
              {pregnancyProgress.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 font-medium">No pregnancy progress records available yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Add a new entry using the form below</p>
                </div>
              ) : (
                <div className="space-y-6 pl-6">
                  {pregnancyProgress.map((entry, index) => (
                    <div key={index} className="flex relative">
                      <div className="absolute -left-6 mt-1">
                        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-100 text-purple-700 font-bold">
                          {entry.recordValue?.gestationalAge || "?"}
                        </div>
                        {index < pregnancyProgress.length - 1 && (
                          <div className="h-full w-0.5 bg-purple-100 absolute top-10 bottom-0 left-5 -ml-px"></div>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 ml-6 w-full hover:shadow-lg transition-shadow">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-purple-700">Week {entry.recordValue?.gestationalAge}</span>
                          <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <p className="font-medium mb-1 text-gray-800">{entry.recordValue?.milestone}</p>
                        <p className="text-gray-600 text-sm italic">{entry.recordValue?.symptoms || "No symptoms listed"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add New Pregnancy Progress */}
            <div className="bg-white rounded-xl shadow-xl p-6 transition-shadow hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Add New Pregnancy Progress</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gestational Age (weeks) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPregnancyProgress.gestationalAge}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewPregnancyProgress(prev => ({ ...prev, gestationalAge: value }));
                      // Validate on input change
                      if (value > 40) {
                        setGestationalAgeError('Max week size should be 40');
                      } else {
                        setGestationalAgeError('');
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    placeholder="e.g. 12"
                    min="1"
                    max="40"
                    required
                  />
                  {gestationalAgeError && (
                    <p className="text-red-500 text-sm mt-1">{gestationalAgeError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Milestone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPregnancyProgress.milestone}
                    onChange={(e) => setNewPregnancyProgress({ ...newPregnancyProgress, milestone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    placeholder="e.g. First ultrasound"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                  <textarea
                    value={newPregnancyProgress.symptoms}
                    onChange={(e) => setNewPregnancyProgress({ ...newPregnancyProgress, symptoms: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow resize-none"
                    placeholder="Describe any symptoms the patient is experiencing..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleAddPregnancyProgress}
                  disabled={isSubmitting} 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center min-w-32 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Add Progress Entry'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Vaccination Progress Section */}
        {activeTab === 'vaccination' && (
          <div className="space-y-8">
            {/* Vaccination Records */}
            <div className="bg-white rounded-xl shadow-xl p-6 transition-shadow hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Vaccination Records</h2>
              </div>
              
              {vaccinationProgress.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 font-medium">No vaccination records available yet.</p>
                  <p className="text-gray-400 text-sm mt-1">Add a new vaccination record using the form below</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vaccinationProgress.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-purple-600">
                            {entry.recordValue?.vaccineName || "No Name"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(entry.recordValue?.dateGiven).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entry.recordValue?.status === 'Completed' ? 
                              'bg-green-100 text-green-800' : 
                              entry.recordValue?.status === 'Upcoming' ? 
                              'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.recordValue?.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {entry.recordValue?.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Add New Vaccination */}
            <div className="bg-white rounded-xl shadow-xl p-6 transition-shadow hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Add New Vaccination</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccine Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVaccinationProgress.vaccineName}
                    onChange={(e) => setNewVaccinationProgress({ ...newVaccinationProgress, vaccineName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    placeholder="e.g. Tetanus Toxoid"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Given <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newVaccinationProgress.dateGiven}
                    onChange={(e) => setNewVaccinationProgress({ ...newVaccinationProgress, dateGiven: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newVaccinationProgress.status}
                    onChange={(e) => setNewVaccinationProgress({ ...newVaccinationProgress, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newVaccinationProgress.notes}
                    onChange={(e) => setNewVaccinationProgress({ ...newVaccinationProgress, notes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow resize-none"
                    placeholder="Any relevant notes about this vaccination..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleAddVaccinationProgress}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center min-w-32 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Add Vaccination Record'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressTracking;
