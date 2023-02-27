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

  launchMatlab() {
    fetch('http://localhost:5000/launch_matlab', {
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Non-200 code from launch_matlab/');
        }
        console.log('Successfully launched MATLAB!');
      })
      .catch(error => {
        console.error('There was a problem with the fetch request:', error);
      });
  }

  logout() {
    this.loginService.logout();
    this.refreshLoginStatus();
  }

  ngOnInit(): void {
    this.refreshLoginStatus();
  }
}
