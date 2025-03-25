const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visitDate: { type: Date, required: true },
  visitType: { type: String, required: true }, 
  notes: { type: String },
});

module.exports = mongoose.model('Visit', visitSchema);
