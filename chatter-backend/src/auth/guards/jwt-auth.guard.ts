import { AuthGuard } from '@nestjs/passport';

//local strategy is created by class JwtStrategy extends PassportStrategy 'jwt'
//out of the box, JwtAuthGuard will be able to guard http rest endpoints. But
//for GraphQL, we need to modify the ExecutionContext
export class JwtAuthGuard extends AuthGuard('jwt') {}
