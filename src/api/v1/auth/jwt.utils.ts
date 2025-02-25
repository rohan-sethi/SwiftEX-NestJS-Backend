import * as jwt from 'jsonwebtoken';

export const signJwtToken = (payload: any): string => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const LoginJwtToken = (payload: any): string => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretKey, { expiresIn: '30d' });
};