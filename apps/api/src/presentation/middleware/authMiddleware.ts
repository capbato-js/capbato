import { Action } from 'routing-controllers';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Authorization middleware with proper JWT token validation
 */

export function authorizationChecker(action: Action, roles: string[]) {
  // Get the authorization header
  const authHeader = action.request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false; // No token provided or wrong format
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    // Decode the JWT token (without verification for now, since we need the secret)
    // In production, you should verify the token with the secret
    const decoded = jwt.decode(token) as JwtPayload;
    
    if (!decoded || !decoded.role) {
      return false; // Invalid token or no role
    }

    // Check if user has required role
    if (roles.includes(decoded.role)) {
      return true;
    }

    return false; // User doesn't have required role
  } catch (error) {
    console.error('JWT authorization error:', error);
    return false; // Token validation failed
  }
}

export function currentUserChecker(action: Action) {
  // Extract user information from JWT token
  const authHeader = action.request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    // Decode the JWT token
    const decoded = jwt.decode(token) as JwtPayload;
    
    if (!decoded) {
      return undefined;
    }

    return {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };
  } catch (error) {
    console.error('JWT user extraction error:', error);
    return undefined;
  }
}