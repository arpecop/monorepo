import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.HASURA_JWT_SECRET || '3EK6sD+o0+c7tzBNVfjpMkNDi2yAsAAKzQlk8O2IKoxQu4nF7EsAh8s3TwpHwrdWT6R';

export interface JWTPayload {
  sub: string; // user id
  username: string;
  iat?: number;
  exp?: number;
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
  };
}

export function generateToken(userId: number, username: string): string {
  const payload: JWTPayload = {
    sub: userId.toString(),
    username,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-user-id': userId.toString(),
    },
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h',
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
