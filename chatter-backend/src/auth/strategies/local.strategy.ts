import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  //Local strategy will automatically retunr the value of this function to the response body
  async validate(email: string, password: string) {
    try {
      return await this.usersService.verifyUser(email, password);
    } catch (err) {
      //if we throw this error back to user, he may know exact reasons of email/password
      //which could lead to brute force attack, we would have to reduce the expose information
      throw new UnauthorizedException('Credentials are not valid');
    }
  }
}
