import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-twitch-callback",
  template: "",
})
export class TwitchCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (sessionStorage.getItem("state") != params["state"]) return;
      this.http
        .get(environment.apiUrl + "/callback/twitch?code=" + params["code"], {
          observe: "response",
        })
        .subscribe(
          (resp) => {
            this.cookieService.set(
              "token",
              resp.headers.get("token"),
              0.041,
              "/"
            );
            this.router.navigate(["/dashboard"]).then();
          },
          (error) => this.router.navigate(["/error"], { state: error })
        );
    });
  }
}
