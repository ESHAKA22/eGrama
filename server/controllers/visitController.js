const Visit = require('../models/Visit');

// Create a new visit
exports.createVisit = async (req, res) => {
  const { patientId, visitDate, visitType, notes } = req.body;

  try {
    const newVisit = new Visit({ patientId, visitDate, visitType, notes });
    await newVisit.save();
    res.status(201).json(newVisit);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Get visits for a patient
exports.getVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ patientId: req.params.patientId }).populate('patientId');
    res.json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
