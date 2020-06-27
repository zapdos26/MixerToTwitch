import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cookieService.get("token")) {
      return true;
    }

    this.router
      .navigate(["/login"], { queryParams: { returnUrl: state.url } })
      .then();
    return false;
  }
}
