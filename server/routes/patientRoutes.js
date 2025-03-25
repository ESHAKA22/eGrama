const express = require('express');
const { addExistingUserAsPatient, getAllPatients,getPatientById, updatePatientDetails, getPatientByUserId, deletePatient } = require('../controllers/patientController');
const router = express.Router();

//get all patients
router.get('/byUserId/:userId', getPatientByUserId);

router.get('/',getAllPatients);

router.post('/addExistingUser', addExistingUserAsPatient); 
router.get('/:id', getPatientById);
router.delete('/:id', deletePatient);

router.put('/updateDetails/:id', updatePatientDetails);




module.exports = router;
