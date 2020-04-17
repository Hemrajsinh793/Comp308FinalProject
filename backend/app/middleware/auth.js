const jwt= require('jsonwebtoken');
const config= require('config');

module.exports = function auth(req,res,next){
  const token= req.header('x-auth-token');
  console.log("Token here HOW?" , token);

  if(!token ) return res.status(401).send('Access Denied. No Token Provided');

  try{
    
    const decode= jwt.verify(token, "jwtprivatekey");
    
    req.user= decode;
    console.log("deocde version", decode);
    console.log(decode.firstName);
    console.log(decode.role);
    next();
  }
  catch(ex){
    res.status(400).send("Invalid Token");
  }

  
}