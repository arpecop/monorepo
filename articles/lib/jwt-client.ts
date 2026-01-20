// Client-side JWT verification (only for checking expiration, not for security)
export interface JWTPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
  };
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    // Decode JWT without verification (client-side only checks expiration)
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    return payload as JWTPayload;
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}
