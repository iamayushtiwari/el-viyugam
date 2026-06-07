import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password, name } = dto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
  data: { email, passwordHash: hashedPassword, name },  // 👈 use passwordHash
  select: { id: true, email: true, name: true, createdAt: true },
});

      return { message: 'Account created successfully', user };
    } catch {
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async login(loginDto: LoginDto, res: Response) {
  const { email, password } = loginDto;

  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.passwordHash);  // 👈 use passwordHash

  if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  const accessToken = await this.jwtService.signAsync(
    { userId: user.id },
    { secret: process.env.JWT_SECRET, expiresIn: '15m' }
  );

  const refreshToken = await this.jwtService.signAsync(
    { userId: user.id },
    { secret: process.env.JWT_SECRET, expiresIn: '7d' }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return { message: 'Login successful', accessToken };
}


  async refreshToken(req: Request): Promise<string> {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = await this.jwtService.signAsync(
        { userId: payload.userId },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }
      );

      return newAccessToken;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
