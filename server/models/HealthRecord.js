 const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  recordType: { type: String, required: true },  
  recordValue: { type: mongoose.Schema.Types.Mixed },  
  date: { type: Date, required: true },  
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
