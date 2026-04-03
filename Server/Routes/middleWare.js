// middleware/auth.js
import dotenv from "dotenv"
dotenv.config();

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token; // assuming the JWT is stored in a cookie named 'token'

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // your secret key
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};