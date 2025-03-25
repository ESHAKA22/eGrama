const HealthRecord = require('../models/HealthRecord');

// Create a new health record
exports.createHealthRecord = async (req, res) => {
  const { patientId, recordType, recordValue, date } = req.body;

  try {
    const newRecord = new HealthRecord({ patientId, recordType, recordValue, date });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Get health records for a patient
exports.getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.params.patientId });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


exports.addPregnancyProgress = async (req, res) => {
  // Destructure the properties from the incoming request body
  const { patientId, recordType, date, recordValue } = req.body;

  try {
    // Create a new HealthRecord using the data from the frontend
    const newProgress = new HealthRecord({
      patientId,
      recordType,    // This will be "Vaccination Progress" as per the frontend object
      recordValue,   // Contains vaccineName, dateGiven, status, notes
      date,          // Date provided from the frontend (or you could use Date.now() if needed)
    });

    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



exports.addVaccinationProgress = async (req, res) => {
  const { patientId, vaccineName, dateGiven, status, notes } = req.body;

  try {
    const newVaccination = new HealthRecord({
      patientId,
      recordType: 'Vaccination Progress',
      recordValue: { vaccineName, dateGiven, status, notes },
      date: new Date(),
    });

    await newVaccination.save();
    res.status(201).json(newVaccination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add vaccination progress' });
  }
};
