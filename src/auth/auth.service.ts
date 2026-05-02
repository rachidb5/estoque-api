// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/application/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);
const REFRESH_TOKEN_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, response?: Response) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      password: hash,
      role: 'vendedor',
    });

    return this.createSession(user, response);
  }

  async login(dto: LoginDto, response?: Response) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.createSession(user, response);
  }

  async refresh(refreshToken: string | undefined, response?: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente');
    }

    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const user = await this.usersService.findByRefreshTokenHash(
      refreshTokenHash,
    );

    if (
      !user?.refresh_token_expires ||
      user.refresh_token_expires.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException('SessÃ£o expirada');
    }

    return this.createSession(user, response);
  }

  async me(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('UsuÃ¡rio nÃ£o encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async logout(refreshToken: string | undefined, response?: Response) {
    if (refreshToken) {
      const user = await this.usersService.findByRefreshTokenHash(
        this.hashRefreshToken(refreshToken),
      );

      if (user) {
        await this.usersService.clearRefreshToken(user.id);
      }
    }

    this.clearRefreshCookie(response);
    return { message: 'SessÃ£o encerrada' };
  }

  private async createSession(
    user: {
      id: string;
      email: string;
      role: 'vendedor' | 'gestor' | 'admin';
      username: string;
    },
    response?: Response,
  ) {
    const refreshToken = this.generateRefreshToken();
    const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_MS);

    await this.usersService.setRefreshToken(
      user.id,
      this.hashRefreshToken(refreshToken),
      refreshTokenExpires,
    );
    this.setRefreshCookie(response, refreshToken, refreshTokenExpires);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  private generateRefreshToken() {
    return randomBytes(64).toString('hex');
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private setRefreshCookie(
    response: Response | undefined,
    refreshToken: string,
    expiresAt: Date,
  ) {
    if (!response) {
      return;
    }

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...this.getRefreshCookieOptions(),
      expires: expiresAt,
      maxAge: REFRESH_TOKEN_MS,
    });
  }

  private clearRefreshCookie(response: Response | undefined) {
    response?.clearCookie(
      REFRESH_TOKEN_COOKIE,
      this.getRefreshCookieOptions(),
    );
  }

  private getRefreshCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/auth',
    };
  }
}
