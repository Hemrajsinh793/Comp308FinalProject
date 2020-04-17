const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const ReportNurse = new Schema({
  nurseid: String,
  nursename: String,

  patientid: String,

  patientemail: String,

  bodytemperature: String,
  heartrate: String,
  bloodpressure: String,
  respiratoryrate: String,
  created: {
		type: Date,
		default: Date.now
	}
});

function validatereportnurse(report){
  const schema= {
    nurseid: Joi.string().required(),
    patientid: Joi.string().min(3).required(),
    nursename: Joi.string().min(3).required(),
    patientemail: Joi.string().min(3).required().email(),
    bodytemperature: Joi.string().min(3).max(255).required(),
    heartrate: Joi.string().min(3).max(255).required(),
    bloodpressure: Joi.string().min(3).max(255).required(),
    respiratoryrate: Joi.string().min(3).max(255).required(),
  }
  return Joi.validate(report, schema);
} 

mongoose.model('ReportNurse', ReportNurse);
exports.validatereportnurse= validatereportnurse;