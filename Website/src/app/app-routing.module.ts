import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ErrorComponent } from "./error/error.component";
import { AuthGuard } from "./_helpers/auth.guard";
import { TwitchCallbackComponent } from "./callbacks/twitch-callback/twitch-callback.component";
import { TosComponent } from "./tos/tos.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { MixerCallbackComponent } from "./callbacks/mixer-callback/mixer-callback.component";

const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "error", component: ErrorComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "callback/mixer", component: MixerCallbackComponent },
  {
    path: "callback/twitch",
    component: TwitchCallbackComponent,
    canActivate: [AuthGuard],
  },
  { path: "tos", component: TosComponent },
  { path: "privacy", component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
