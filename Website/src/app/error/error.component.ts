import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  state:HttpErrorResponse
  errorStatusCode:number
  errorStatusText:string
  errorMessage:string

  constructor() {
    this.state = window.history.state
    console.log(this.state)
    this.errorStatusCode = this.state.status
    this.errorStatusText = this.state.statusText
    this.errorMessage = this.state.error.error.message
  }

  ngOnInit(): void {
  }

}
