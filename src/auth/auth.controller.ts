// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(dto, response);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(dto, response);
  }

  @Post('refresh')
  refresh(
    @Req() request: Request,
    @Body('refresh_token') refreshTokenBody: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken =
      refreshTokenBody ?? this.getCookie(request, 'refreshToken');

    return this.authService.refresh(refreshToken, response);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() request: Request & { user?: { userId: string } }) {
    return this.authService.me(request.user!.userId);
  }

  @Post('logout')
  logout(
    @Req() request: Request,
    @Body('refresh_token') refreshTokenBody: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken =
      refreshTokenBody ?? this.getCookie(request, 'refreshToken');

    return this.authService.logout(refreshToken, response);
  }

  private getCookie(request: Request, name: string) {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  }
}
