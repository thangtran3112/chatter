import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

//Passport will automatically populate 'user' through LocalStrategy.validate() function
//Extract the current user from in-flight request
const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'http') {
    //switchToHttp() will return Http arguements, which work for Rest request, but not for GraphQL
    return context.switchToHttp().getRequest().user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req.user;
  }
  return context.switchToHttp().getRequest().user;
};

// Create param decorators, which we can later on use these on route (such as /auth/login)
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
