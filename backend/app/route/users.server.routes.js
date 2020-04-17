const user= require('../controller/user.server.controller');
const sym= require('../controller/covid');
const auth= require('../middleware/auth');
const express= require('express');
const router= express.Router();


	
router.post('/register', user.register);

router.post('/login', user.login);

router.post('/reportnurse',auth, user.reportnurse);

router.get('/listallreports', auth , user.listallreports);

router.post('/listbyemail', auth, user.listbyemail);

router.post('/reportuser', auth, user.reportuser );

router.get('/read_cookie', user.findtoken);

router.post('/rundiagnosis', sym.checkConditions);

module.exports= router;