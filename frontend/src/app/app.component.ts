import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorMessages, successMessages } from './helpers/custom-validators';
import { AuthenticatedRequest, BackendService } from './services/backend.service';
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
  userType = '';

  constructor(public loginService: LoginService, private snackBar: MatSnackBar, private backendService: BackendService) { }

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
          this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-warn'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          throw new Error('Non-200 code from launch_matlab/');
        }
        this.snackBar.open(successMessages['matlabSuccessfulLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.log('Successfully launched MATLAB!');
      })
      .catch(error => {
        this.snackBar.open(errorMessages['matlabFailedLaunch'], '', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        console.error('Matlab error:', error);
      });
  }

  logout() {
    this.loginService.logout();
    this.refreshLoginStatus();
  }

  async ngOnInit() {
    this.refreshLoginStatus();

    if (this.loggedIn) {
      let authenticatedRequest = {
        email: localStorage.getItem('email'),
        session_id: localStorage.getItem('session_id'),
      } as AuthenticatedRequest;

      this.userType = await this.backendService.getUserType(authenticatedRequest);

      if (this.userType != "Patient" && this.userType != "Therapist") {
        // User hasn't submitted a form yet
        return;
      }
    }
  }
}
