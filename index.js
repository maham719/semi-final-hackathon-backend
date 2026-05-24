import express from "express";
import "dotenv/config";
import connectToDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";

const app = express();

const port = 4002;
connectToDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://semi-final-hackathon.vercel.app/",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/upload",uploadRouter)

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
