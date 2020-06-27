import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoginComponent } from "./login/login.component";
import { AppRoutingModule } from "./app-routing.module";
import { ServiceStatusComponent } from "./components/service-status/service-status.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MixerCallbackComponent } from "./callbacks/mixer-callback/mixer-callback.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { ErrorComponent } from "./error/error.component";
import { TwitchCallbackComponent } from "./callbacks/twitch-callback/twitch-callback.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { JwtInterceptorService } from "./services/JwtInterceptor/jwt-interceptor.service";
import { ErrorInterceptorService } from "./services/Error-Interceptor/error-interceptor.service";
import { TosComponent } from "./tos/tos.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ServiceStatusComponent,
    MixerCallbackComponent,
    ErrorComponent,
    TwitchCallbackComponent,
    TosComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule,
    ScrollingModule,
    MatExpansionModule,
    MatToolbarModule,
    MatTabsModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
