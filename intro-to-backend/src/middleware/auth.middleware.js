import jwt from "jsonwebtoken";      // import JWT library to verify tokens
import dotenv from "dotenv";         // import dotenv to read .env variables

dotenv.config();                     // load environment variables from .env


// middleware function to verify JWT token
export const verifyToken = (req, res, next) => {
  try {

    // get Authorization header from request
    const authHeader = req.headers.authorization;

    // if header not present → user not logged in
   
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. Token not provided"
      });
    }

    // header format: "Bearer TOKEN" ( Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
    // split by space and get the token part

    const token = authHeader.split(" ")[1];


    // if token missing
    if (!token) {
      return res.status(401).json({
        message: "Invalid token format"
      });
    }

    // verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach decoded user data to request
    req.user = decoded;

    // move to next middleware or controller
    next();

  } catch (error) {

    // if token invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};