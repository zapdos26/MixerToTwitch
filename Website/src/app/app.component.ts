import { Component } from "@angular/core";
import * as CryptoJS from "crypto-js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "MixerToTwitch";
  constructor() {
    if (sessionStorage.getItem("state") == null) {
      sessionStorage.setItem(
        "state",
        CryptoJS.lib.WordArray.random(20).toString()
      );
    }
  }
}
