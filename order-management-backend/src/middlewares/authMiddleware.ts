import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized: No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;

    // Attach the decoded token to req for access in controllers
    (req as any).user = decoded;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Not authorized: Token invalid or expired" });
  }
};
