import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from 'src/utils/jwtHandler';

@Injectable()
export class AuthenticateUser implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token)
      throw new HttpException('Auth token not provided', HttpStatus.FORBIDDEN);

    const { phoneNumber, _id } = verifyJwtToken(token);
    if (!phoneNumber || !_id)
      throw new HttpException('Invalid token provided', HttpStatus.FORBIDDEN);

    req.query.phoneNumber = phoneNumber;
    req.query.userId = _id;

    next();
  }
}
