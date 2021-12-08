import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // console.log(request.currentUser);

    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin;
    // or
    // if (request.currentUser.admin) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
}
