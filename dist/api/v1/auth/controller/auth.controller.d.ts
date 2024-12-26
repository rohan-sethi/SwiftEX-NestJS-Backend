import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(authCredentialsDto: AuthCredentialsDto): Promise<{
        token: string;
    }>;
}
