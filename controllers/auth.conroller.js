import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const  register=async(req,res)=>{
    const {name,email,password,confirmPassword}=req.body
    if(!name || !email || !password){
     return   res.status(400).json({message:"all fields are required"})
    }
        if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }
    try {
        const existingUser= await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"user already exists"})
        }
       

        const hashedPassword=await bcrypt.hash(password,10)
        const user=new User({
            name,
            email,
            password:hashedPassword,
        })
        await user.save()
        res.status(201).json({
             message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
        })
    } catch (error) {
        console.error("error registering user", error)
        res.status(500).json({message:"internal server error"})
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body

      if(!email || !password){
     return   res.status(400).json({message:"all fields are required"})
    }
    try {
         const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"invalid credentials"})
    }
    const accessToken= jwt.sign({
        id:user._id,
        role:user.role
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
    
      const refreshToken= jwt.sign({
        id:user._id,
        role:user.role
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})


    res.cookie("refreshtoken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7 *24 * 60 * 60 *1000
    })

    res.status(200).json({
        message:"user logged in successfully",
        accessToken,
      user:{
        id:user._id,
        email:user.email,
        role:user.role
      }
    })
     

    } catch (error) {
        
        console.error("Error loggin in user",error)
        res.status(500).json({message:"server error"})
    }
}

export const refreshtoken=async(req,res)=>{
    const token=req.cookies.refreshtoken
    if(!token){
        return res.status(400).json({message:"no refresh token provided"})
    }
    try {
        const decoded=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        const user=await User.findById(decoded.id)

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const newAccessToken= jwt.sign(
            {id:user._id,role:user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"}
        )
       
        res.status(200).json({
            accessToken:newAccessToken,
            user:{
                id:user._id,
                username:user.name,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        console.error("error refreshing token",error)
        res.status(500).json({message:"server error"})
    }
}

export const logout=(req,res)=>{
try {
    res.clearCookie("refreshtoken" ,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7 * 24 * 60 *60 * 1000
    })
    res.status(200).json({message:"logged out successfuly"})
} catch (error) {
    console.error("error logging out user",error)
    return res.status(500).json({message:"server error"})
}
}