const { validatereportnurse } = require("../model/reportnurse.server.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
var nodeoutlook = require("nodejs-nodemailer-outlook");
const User = require("mongoose").model("User");
const {
  validate,
  validatelogin,
  generateAuthToken,
} = require("../model/user.server.model");
const ReportNurse = require("mongoose").model("ReportNurse");
const ReportUser = require("mongoose").model("ReportUser");
const Emergency = require("mongoose").model("Emergency");
const config = require("config");

exports.findtoken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }

  var payload;
  try {
    const token = req.cookies.token;
    console.log("to check token", token);
    console.log("checking cookie for debug", req.cookies.token);
    payload = jwt.verify(token, "jwtPrivateKey");
    res.status(200).send({ screen: payload.firstName });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
};

exports.register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    console.log("error is here", error.details[0].message);
    res.send({"err": error.details[0].message});
  } 
  
  else {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({"err": "User Exists"});

    if (req.body.password !== req.body.confirmpassword) {
      res.send({"err": "Passwords did not match"});
    } 
    
    else {
      const user12 = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        email: req.body.email,
      });

      const salt = await bcrypt.genSalt(10);
      user12.password = await bcrypt.hash(user12.password, salt);
      user12.confirmpassword = await bcrypt.hash(user12.confirmpassword, salt);

      await user12.save();

     

      const token = user12.generateAuthToken();
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(user12);
    }
  }
};

exports.login = async (req, res) => {
  const { error } = validatelogin(req.body);
  if (error)  {
    console.log("here for error")
    console.log(error.details[0].message);
    return res.status(200).send({"err": error.details[0].message})
  };
  

  let user = await User.findOne({ email: req.body.username });
  if (!user) return res.status(200).send({"err": "Invalid Email or Password"});

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(200).send({"err": "Invalid Email or Password"});

  const token = user.generateAuthToken();
  console.log("token is here", token);

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ screen: user, token });
};

exports.reportnurse = async (req, res) => {
  console.log("Came here");
  

  const nurseid = req.user._id;
  console.log(nurseid);

  let nurseprofile = await User.findOne({ _id: nurseid });

  if (nurseprofile.role != "Nurse") {
    res.status(401).send("Not Authorised");
  } else {
    console.log("nurse profile", nurseprofile);

    const reportNurse = new ReportNurse({
      nurseid: req.user._id,
      nursename: nurseprofile.email,
      patientid: req.body.patientid,
      patientemail: req.body.patientemail,
      bodytemperature: req.body.bodytemperature,
      heartrate: req.body.heartrate,
      bloodpressure: req.body.bloodpressure,
      respiratoryrate: req.body.respiratoryrate,
    });

    await reportNurse.save();
    res.send(reportNurse);
  }
};

exports.listallreports = async (req, res) => {
  console.log("checking cookie for debug", req.cookies.token);
  const nurseid = req.user._id;
  console.log(nurseid);

  let nurseprofile = await User.findOne({ _id: nurseid });

  if (nurseprofile.role != "Nurse") {
    res.status(401).send("Not Authorised");
  } else {
    await ReportNurse.find({}, (err, reports) => {
      if (err) {
        return next(err);
      }

      res.send(reports);
      console.log(reports);
    });
  }
};

exports.listbyemail = async (req, res) => {
  const nurseid = req.user._id;
  console.log(nurseid);

  let nurseprofile = await User.findOne({ _id: nurseid });

  if (nurseprofile.role != "Nurse") {
    res.status(401).send("Not Authorised");
  } else {
    const patientemail = req.body.patientemail;
    console.log("Id searching for", patientemail);
    await ReportNurse.find({ patientemail }, (err, reports) => {
      if (err) {
        return next(err);
      } else {
        res.send(reports);
      }
    });
  }
};

exports.reportuser = async (req, res) => {
  const userid = req.user._id;
  console.log(userid);

  let userprofile = await User.findOne({ _id: userid });

  if (userprofile.role != "Patient") {
    res.status(401).send("Not Authorised");
  } else if (userprofile.role == "Patient") {
    const report = new ReportUser({
      patientid: userid,
      patientemail: userprofile.email,
      pulserate: req.body.pulserate,
      weight: req.body.weight,
      bloodpressure: req.body.bloodpressure,
      temperature: req.body.temperature,
      respiratoryrate: req.body.respiratoryrate,
    });

    await report.save();
    res.send(report);
  }
};

exports.emergency = async (req, res) => {
  const userid = req.user._id;

  let userprofile = await User.findOne({ _id: userid });

  if (userprofile.role != "Patient") {
    res.status(401).send("Not Authorised");
  } else if (userprofile.role == "Patient") {
    const emergencyrep = new Emergency({
      patientid: userid,
      patientemail: userprofile.email,
      message: req.body.message,
    });

    

    await emergencyrep.save();
    res.send(emergencyrep);
  }
};
