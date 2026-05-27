import { Controller, Post, Body, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
async login(@Body() loginDto: LoginDto, @Res() res: Response) {
  const result = await this.authService.login(loginDto, res);
  return res.json(result);  // 👈 explicitly send response
}


  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const token = await this.authService.refreshToken(req);
      return res.json({ accessToken: token });
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }
  }
}
