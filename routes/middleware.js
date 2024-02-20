const jwt = require("jsonwebtoken")
const StatusCode = require("../statusCode")
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" }); 
const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware =  function(req,res,next){
    const authHeader = req.headers.authorization

    try{
       const token = jwt.verify(authHeader,JWT_SECRET)
       req.userId = token.userId
       next();
    }
    catch(e){
         res.status(StatusCode.Forbidden).json({
            message : "Invalid User"
         })
    }

}

module.exports = {
    authMiddleware
}