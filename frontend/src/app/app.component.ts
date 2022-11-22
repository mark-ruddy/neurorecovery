import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  loggedIn = false;
  email = '';

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.email.subscribe(email => this.email = email);
    this.loginService.loggedIn.subscribe(loggedIn => this.loggedIn = loggedIn);
  }
}
