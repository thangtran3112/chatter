import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      //extract jwt from incoming request
      jwtFromRequest: ExtractJwt.fromExtractors([
        //we know the cookies was created with the name 'Authentication' from auth.service.ts
        (request: Request) => request.cookies.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  /**
   * validate method must use the exact argument of cookies.Authentication
   * We already extract the token in above constructor 'request.cookies.Authentication'
   * The payload return from the extraction is TokenPayload
   * Whatever we return from here, will be attached to request.user
   * */
  validate(payload: TokenPayload) {
    return payload;
  }
}
