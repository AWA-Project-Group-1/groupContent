import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.userId, email: decoded.user }; 
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("Error verifying token:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authenticate;