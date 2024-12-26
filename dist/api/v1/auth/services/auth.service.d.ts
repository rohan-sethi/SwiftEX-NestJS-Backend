import * as jwt from 'jsonwebtoken';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/schema/user.schema';
export declare class AuthService {
    private readonly userService;
    private readonly jwtSecret;
    constructor(userService: UserService);
    validateUser(email: string, otp: string): Promise<User | null | string>;
    login(user: User): Promise<{
        token: string;
    }>;
    verifyToken(token: string): string | jwt.JwtPayload;
}
