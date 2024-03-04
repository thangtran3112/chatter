import { AuthGuard } from '@nestjs/passport';

//local strategy is created by class LocalStrategy extends PassportStrategy(Strategy, default = 'local'
export class LocalAuthGuard extends AuthGuard('local') {}
