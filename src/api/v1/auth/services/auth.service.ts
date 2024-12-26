import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/schema/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET;

  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, otp: string): Promise<User | null | string> {
    const user = await this.userService.findOneByEmail(email);
  
    // Case 1: User not found
    if (!user) {
      return null;
    }
  
    // Case 2: User exists but email is not verified
    if (!user.isEmailVerified) {
      return 'Please verify your email';
    }
  
    // Case 3: User exists, email is verified, and OTP matches
    if (bcrypt.compareSync(otp, user.passcode)) {
      return user;
    }
  
    // Case 4: OTP does not match
    return null;
  }
  // Generate JWT token
  async login(user: User) {
    const payload = { email: user.email, sub: user._id };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '3d' }); 
    
    return {
      token, 
    };
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret); 
      return decoded; 
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
