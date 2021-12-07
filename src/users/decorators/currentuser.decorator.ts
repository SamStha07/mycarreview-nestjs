/*
https://docs.nestjs.com/openapi/decorators#decorators
*/

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
