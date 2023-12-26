import jwt from 'jsonwebtoken';
import { JWT_EXPIRE_TIME } from './constants';
import { config } from 'dotenv';
config();

export const signJwtToken = (user) => {
  try {
    const { phoneNumber, _id } = user;
    const token = jwt.sign({ phoneNumber, _id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRE_TIME,
    });
    return token;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

export const verifyJwtToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    const tokenArray = token.split(' ');
    const tokenToUse = tokenArray.length === 2 ? tokenArray[1] : tokenArray[0];
    return jwt.verify(tokenToUse, secret);
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
