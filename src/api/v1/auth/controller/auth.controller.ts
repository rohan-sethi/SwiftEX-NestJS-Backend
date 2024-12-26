import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';


@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  
async login(@Body() authCredentialsDto: AuthCredentialsDto) {
  const { email, otp } = authCredentialsDto;
  const user = await this.authService.validateUser(email, otp);
  // Handle cases based on the result from validateUser
  if (user === null) {
    throw new UnauthorizedException('Invalid credentials');
  }
  if (typeof user === 'string') { // 'Please verify your email' message
    throw new BadRequestException(user);
  }
  // If user is valid and authenticated
  return this.authService.login(user);
}
}
