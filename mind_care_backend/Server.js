import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


import authRoutes from "./routes/authROutes.js";
import "./config/Passport.js";
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI);

// Routes
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
