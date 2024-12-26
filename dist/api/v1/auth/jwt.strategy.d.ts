import { UserService } from '../user/service/user.service';
import { AuthService } from './services/auth.service';
import { JwtPayload } from 'jsonwebtoken';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    validate(payload: JwtPayload): Promise<import("../user/schema/user.schema").User>;
}
export {};
