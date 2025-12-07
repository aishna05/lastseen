// src/lib/auth.ts
import jwt from "jsonwebtoken";

// Type definition for the data expected inside the JWT
type DecodedToken = {
  // Change to 'number' to match Int @default(autoincrement()) in schema.prisma
  userId: number; 
  role: string;
  email: string;
};

// Base function to verify the token and decode the payload
export function verifyToken(authHeader: string | null) {
  const secret = process.env.JWT_SECRET || "";
  
  if (!authHeader) {
    return { valid: false, error: "Missing authorization header" as const };
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return { valid: true, decoded };
  } catch (e) {
    return { valid: false, error: "Invalid or expired token" as const };
  }
}

// Function to verify a token and confirm the user is a SELLER
export function verifySellerAuth(authHeader: string | null) {
// ... (rest of the function remains the same)
  const base = verifyToken(authHeader);
  
  if (!base.valid) return base;

  if (!base.decoded || base.decoded.role !== "SELLER") {
    return { valid: false, error: "Forbidden: Not a seller" as const };
  }

  return base;
}