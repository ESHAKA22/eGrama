const Patient = require('../models/Patient');
const User = require('../models/User');


// Add existing users as patients
exports.addExistingUserAsPatient = async (req, res) => {
  const { patients } = req.body;

  try {
    const newPatients = [];
    for (let patient of patients) {
      const { userId, patientType } = patient;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }

      // Create a new patient document
      const newPatient = new Patient({
        userId,
        patientType,
        details: patient.details || {},
      });

      // Save the new patient
      await newPatient.save();
      newPatients.push(newPatient);
    }

    // Respond with the newly created patients
    res.status(201).json(newPatients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
//get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name'); // Populate userId with name field from User model
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

//get patient by id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name'); // Populate userId with name field from User model
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
//update patient by id

exports.updatePatientDetails = async (req, res) => {
  const { id } = req.params;
  const { details } = req.body; // Expecting an object with multiple details

  try {
    // Find the patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Update the details of the patient
    patient.details = { ...patient.details, ...details }; // Merge new details with existing details

    await patient.save();
    res.status(200).json(patient); // Return the updated patient
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


exports.getPatientByUserId = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.userId });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Delete patient by id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    res.status(200).json({ msg: 'Patient removed' });
  } catch (error) {
    console.error(error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid patient ID format' });
    }

    res.status(500).send('Server error');
  }
};
