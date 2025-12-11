// /src/lib/auth.ts
import jwt from "jsonwebtoken";

// Type definition for the data expected inside the JWT payload
export type DecodedToken = {
  userId: number; 
  role: 'CUSTOMER' | 'SELLER' | string; // Use union types if roles are known
  email: string;
};

// Base function to verify the token and decode the payload
export function verifyToken(authHeader: string | null): 
    | { valid: true; decoded: DecodedToken } 
    | { valid: false; error: "Missing authorization header" | "Invalid or expired token" } 
{
  // Ensure the secret is available and handle the case where it's not (crucial for security)
  const secret = process.env.JWT_SECRET;
  if (!secret) {
        // In a production app, log this error and handle it gracefully
        console.error("JWT_SECRET environment variable is not set.");
        // We'll proceed with the assumption that the token will fail verification later if secret is truly missing,
        // but checking for authHeader is the immediate requirement.
  }

  if (!authHeader) {
    return { valid: false, error: "Missing authorization header" as const };
  }

  // Extract the token from the "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    // Use the non-null assertion (!) if you are absolutely sure process.env.JWT_SECRET exists in the environment
    // If you are using an IDE that supports non-null assertion, use it here, otherwise, ensure a fallback.
    const decoded = jwt.verify(token, secret!) as DecodedToken; 
    return { valid: true, decoded };
  } catch (e) {
    return { valid: false, error: "Invalid or expired token" as const };
  }
}

// Function to verify a token and confirm the user is a SELLER
export function verifySellerAuth(authHeader: string | null): 
    | { valid: true; decoded: DecodedToken } 
    | { valid: false; error: "Missing authorization header" | "Invalid or expired token" | "Forbidden: Not a seller" }
{
 const base = verifyToken(authHeader);
 
 if (!base.valid) {
        // Return the initial error (missing header or invalid token)
        return base; 
    }

 // Check if the decoded payload exists and if the role is 'SELLER'
 if (base.decoded.role !== "SELLER") {
  return { valid: false, error: "Forbidden: Not a seller" as const };
 }

 // If valid and the role is SELLER
 return base;
}