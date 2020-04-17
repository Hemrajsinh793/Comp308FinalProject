const user= require('../controller/user.server.controller');
const auth= require('../middleware/auth');
const express= require('express');
const router= express.Router();


	
  router.post('/emergency', auth, user.emergency);

   module.exports= router;
