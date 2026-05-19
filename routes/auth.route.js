import { Router } from "express";
import { login, logout, refreshtoken, register } from "../controllers/auth.conroller.js";


const authRouter= Router()

authRouter.post("/register" , register)
authRouter.post("/login" , login)
authRouter.get("/refresh",refreshtoken)
authRouter.post("/logout",logout)

export default authRouter