const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Joi = require('joi');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
    type: String,
    unique: true,
    index: true,
		match: /.+\@.+\..+/
	},
  password: {
		type: String,
		// Validate the 'password' value length
		validate: [
			(password) => password.length >= 6,
			'Password Should Be Longer'
		]
  },
  confirmpassword: {
		type: String,
		// Validate the 'password' value length
	},
	role: {
		type: String,
		// Validate the 'role' value using enum list
    enum: ['Admin', 'Nurse', 'Patient'],
    default: 'Patient'
	},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	}
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

UserSchema.methods.generateAuthToken = function(){
  const token= jwt.sign( {_id: this._id, role: this.role, firstName: this.firstName, lastName: this.lastName,
  email:this.email} , 'jwtprivatekey');
  return token;
}

function validateStudent(user){
  const schema= {
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(6).max(255).required(),
    confirmpassword: Joi.string().min(6).max(255).required(),
  }
  return Joi.validate(user, schema);
} 

function validatelogin(req){
  const schema= {
    username: Joi.string().min(3).email().required(),
    password: Joi.string().min(6).max(255).required(),
    
  }
  return Joi.validate(req, schema);
  
} ;


mongoose.model('User', UserSchema);

exports.validate= validateStudent;
exports.validatelogin= validatelogin;