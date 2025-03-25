const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  patientType: { type: String, enum: ['Pregnant Mother', 'Baby', 'Child'], required: true },
  details: { type: mongoose.Schema.Types.Mixed }, 
});

module.exports = mongoose.model('Patient', patientSchema);
