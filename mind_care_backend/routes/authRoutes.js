import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/authMiddleware.js";
import { User } from "../models/user.js";

const router = express.Router();

// Google OAuth login
router.get("/google", (req, res, next) => {
  const role = req.query.role || "student"; // default role if not provided
  // Store role in session temporarily
  req.session.role = role;
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const role = req.session.role || "student";

      // Update user role in DB
      await User.findByIdAndUpdate(req.user._id, { role });

      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, { httpOnly: true });
      res.redirect(`http://localhost:8081/dashboard`);
    } catch (err) {
      console.error(err);
      res.redirect("/login");
    }
  }
);


// Protected Routes
router.get("/student/dashboard", requireAuth(["student"]), (req, res) => {
  res.json({ message: "Welcome Student!", user: req.user });
});

router.get("/counselor/dashboard", requireAuth(["counselor"]), (req, res) => {
  res.json({ message: "Welcome Counselor!", user: req.user });
});

router.get("/admin/dashboard", requireAuth(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

export default router;
