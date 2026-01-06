import { Controller, Post, UseGuards, Req, Res, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TUser } from '@shared/types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const { access_token, user } = this.authService.login(req.user as TUser);

    const cookieDomain = this.configService
      .get<string>('COOKIE_DOMAIN', 'gctracker.localhost')
      .replace(/^https?:\/\//, '') // Remove http:// or https://
      .replace(/\/$/, ''); // Remove trailing slash

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      domain: cookieDomain,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieDomain = this.configService
      .get<string>('COOKIE_DOMAIN', 'gctracker.localhost')
      .replace(/^https?:\/\//, '') // Remove http:// or https://
      .replace(/\/$/, ''); // Remove trailing slash

    res.clearCookie('access_token', {
      domain: cookieDomain,
    });
    return { message: 'Logged out successfully' };
  }
}
