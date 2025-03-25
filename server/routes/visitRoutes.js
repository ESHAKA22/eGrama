const express = require('express');
const { createVisit, getVisits } = require('../controllers/visitController');
const router = express.Router();

router.post('/', createVisit); // Create a new visit
router.get('/:patientId', getVisits); // Get visits for a patient

module.exports = router;
