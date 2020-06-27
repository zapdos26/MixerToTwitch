import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-mixer-callback",
  template: ``,
})
export class MixerCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (sessionStorage.getItem("state") != params["state"]) return;
      this.http
        .get(environment.apiUrl + "/callback/mixer?code=" + params["code"], {
          observe: "response",
        })
        .subscribe((resp) => {
          this.cookieService.set(
            "token",
            resp.headers.get("token"),
            0.041,
            "/"
          );
          sessionStorage.setItem(
            "discord",
            JSON.stringify(resp.body["discord"])
          );
          this.router.navigate(["/dashboard"]).then();
        });
    });
  }
}
