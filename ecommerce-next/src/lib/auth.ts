// src/lib/auth.ts
import jwt from "jsonwebtoken";

// Type definition for the data expected inside the JWT
type DecodedToken = {
  // Use 'string' for IDs unless you are 100% sure the DB uses numeric IDs
  userId: string; 
  role: string;
  email: string;
};

// Base function to verify the token and decode the payload
export function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "No token provided" as const };
  }

  const token = authHeader.split(" ")[1];
  // Ensure you have JWT_SECRET set in your .env file
  const secret = process.env.JWT_SECRET!; 
  
  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return { valid: true, decoded };
  } catch (e) {
    return { valid: false, error: "Invalid or expired token" as const };
  }
}

// Function to verify a token and confirm the user is a SELLER
export function verifySellerAuth(authHeader: string | null) {
  const base = verifyToken(authHeader);
  
  // If the token is invalid, return the error immediately
  if (!base.valid) return base;

  // Check the role
  if (!base.decoded || base.decoded.role !== "SELLER") {
    // Note: TypeScript infers the type of error string for better safety
    return { valid: false, error: "Forbidden: Not a seller" as const };
  }

  // If valid and role is SELLER, return the successful base object
  return base;
}