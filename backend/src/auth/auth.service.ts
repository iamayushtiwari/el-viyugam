import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    return {
      message: 'Login validation successful',
      email,
    };
  }
}
