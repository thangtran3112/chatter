import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

export const COOKIE_AUTHENTICATION = 'Authentication';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  //params will be given by auth.controller
  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    const tokenPayload: TokenPayload = {
      ...user,
      _id: user._id.toString(),
    };

    const token = this.jwtService.sign(tokenPayload);
    response.cookie(COOKIE_AUTHENTICATION, token, {
      httpOnly: true,
      expires,
    });
  }

  verifyWs(request: Request): TokenPayload {
    const cookies: string[] = request.headers.cookie.split('; ');

    // Authentication=ey...
    const authCookie = cookies.find((cookie) =>
      cookie.includes(COOKIE_AUTHENTICATION),
    );
    const jwt = authCookie.split(`${COOKIE_AUTHENTICATION}=`)[1];
    return this.jwtService.verify(jwt);
  }

  //simply clear the existing cookies on logout
  logout(response: Response) {
    response.cookie(COOKIE_AUTHENTICATION, '', {
      httpOnly: true,
      // expire the cookie immediately, and the cookie is clear from user session
      expires: new Date(),
    });
  }
}
