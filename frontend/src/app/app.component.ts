import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NeuroRecovery';
  loggedIn = false;
  sessionId = 'NONE';
  email = '';

  constructor(public loginService: LoginService) { }

  refreshLoginStatus() {
    if (localStorage.getItem('logged_in') == 'true') {
      this.email = localStorage.getItem('email')!;
      this.sessionId = localStorage.getItem('session_id')!;
      this.loggedIn = true;
    } else {
      this.email = '';
      this.sessionId = '';
      this.loggedIn = false;
    }
  }

  logout() {
    this.loginService.logout();
    this.refreshLoginStatus();
  }

  ngOnInit(): void {
    this.refreshLoginStatus();
  }
}
