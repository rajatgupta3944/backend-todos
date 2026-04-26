const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
  const token = req.headers.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if(decoded.userId){
    req.userId = decoded.userId;
    next();
  }
  else{
    res.status(403).json({
      message: "Token invalid or not found!"
    })
  }
}

module.exports = {
  authMiddleware
}