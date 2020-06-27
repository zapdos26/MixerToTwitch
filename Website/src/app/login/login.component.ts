import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  Router,
  RouterStateSnapshot,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  checked = false;
  mixerURL =
    "https://mixer.com/oauth/authorize?response_type=code&scope=subscription:view:self&force_verify=true" +
    "&client_id=" +
    environment.mixerClientId +
    "&redirect_uri=" +
    environment.domain +
    "/callback/mixer" +
    "&state=" +
    sessionStorage.getItem("state");

  constructor(
    private router: Router,
    private cookieService: CookieService,
    route: ActivatedRoute
  ) {
    if (this.cookieService.get("token") != null) {
      const url = route.snapshot.queryParams.returnURL || "/dashboard";
      console.log(url);
      this.router.navigate([url]).then();
    }
  }

  ngOnInit() {}

  onCheck() {
    this.checked = !this.checked;
  }
}
