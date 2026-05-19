import jwt from "jsonwebtoken"

export const verifyToken=(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader){
   return res.status(401).json({message:"no token provided"})
  }
  const token=authHeader.split(" ")[1]
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err){
        res.status(403).json({message:"invalid token"})
    }
    req.user=user
    next()
  })
}