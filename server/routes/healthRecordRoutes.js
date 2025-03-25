const express = require('express');
const { createHealthRecord, getHealthRecords, addPregnancyProgress, addVaccinationProgress } = require('../controllers/healthRecordController');
const router = express.Router();

router.post('/', createHealthRecord); 
router.get('/:patientId', getHealthRecords); 
router.post('/pregnancy-progress', addPregnancyProgress);
router.post('/vaccination-progress', addVaccinationProgress);

module.exports = router;
