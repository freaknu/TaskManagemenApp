import jwt from "jsonwebtoken";
import "dotenv/config";

const authentication = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or Expired Token" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default authentication;
