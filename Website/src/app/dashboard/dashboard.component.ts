import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import SyncData from "src/_modals/SyncData";
import UserData from "src/_modals/UserData";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  twitchURL =
    "https://id.twitch.tv/oauth2/authorize?response_type=code&force_verify=true&scope=user_follows_edit user_read&" +
    "client_id=" +
    environment.twitchClientId +
    "&redirect_uri=" +
    environment.domain +
    "/callback/twitch" +
    "&state=" +
    sessionStorage.getItem("state");

  userData: UserData = {
    twitchId: null,
    mixerId: null,
  };

  syncData: SyncData = {
    mixerId: null,
    synced: false,
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.http
      .get(environment.apiUrl + "/users/user/current", {
        headers: {
          Authorization: `Bearer ${cookieService.get("token")}`,
        },
      })
      .subscribe((data) => (this.userData = <UserData>data));
    this.http
      .get(environment.apiUrl + "/users/sync/current", {
        headers: {
          Authorization: `Bearer ${cookieService.get("token")}`,
        },
      })
      .subscribe((data) => (this.syncData = <SyncData>data));
  }
  logout() {
    this.cookieService.delete("token", "/");
    this.router.navigate(["/login"]).then();
  }
}
